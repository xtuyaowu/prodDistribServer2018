let db = require("./db");
let lib = require("./lib");
let wms = require("./wms");
const consola = require("consola");
let R = require("ramda");

/**
 * @desc:根据id信息获取具体的工艺流程
 * 对于多工艺自由组合的情况（人工拉号+全检、人工拉号+码后验证），按全检或码后验证工艺执行，同时在车号列表中记录该万信息，人工可手工抽取该车号；
 * 通过对自由组合的车号列表（均包含人工拉号），由大张班自主手工选定车号，解决需要自动根据产能情况排活的情况，更灵活。
 */
let getProcStream = id => {
  let streamInfo = [
    { proc_stream_id: 0, proc_stream_name: "全检品", remark: "8位清分机全检" },
    { proc_stream_id: 2, proc_stream_name: "码后核查", remark: "正常码后核查" },
    {
      proc_stream_id: 4,
      proc_stream_name: "全检品",
      remark: "人工拉号或8位清分机全检"
    },
    {
      proc_stream_id: 1,
      proc_stream_name: "人工拉号",
      remark: "人工拉号"
    },
    {
      proc_stream_id: 3,
      proc_stream_name: "码后核查工艺验证",
      remark: "码后核查工艺验证 "
    },
    {
      proc_stream_id: 5,
      proc_stream_name: "码后核查工艺验证",
      remark: "人工拉号或码后核查工艺验证"
    },
    { proc_stream_id: 6, proc_stream_name: "补品", remark: "补票" }
  ];
  return R.find(R.propEq("proc_stream_id", parseInt(id, 10)))(streamInfo);
};

/**
 * @desc:记录产品预置工艺，实际设置工艺
 * 流程中的数据库交互流程如下：
 * 1.获取该批车号carnos对应的冠字信息，如果没查询到则置为空字符串；
 * 2.对原始输入信息追加冠字字段信息：对输入的数据转换，从上一步获取到的冠字信息中过滤出所有车号对应的冠字信息；
 * 3.数据入库，记录后台处理程序实际分流的工艺信息；
 */
let recordRealProc = async (
  carnos,
  proc_stream_name,
  remark,
  check_type,
  task_id
) => {
  let rec_time = lib.now();
  console.log("此处读取产品冠字信息");
  let gz_infos = await db.getViewCartfinderGZ(carnos);

  let insertData = carnos.map(cart_number => {
    let gz = R.find(R.propEq("cart_number", cart_number))(gz_infos.data);
    let gz_num;
    if (!R.isNil(gz)) {
      gz_num = gz.gz_num;
      if (R.isNil(gz_num)) {
        gz_num = "";
      }
    }
    return {
      cart_number,
      gz_num,
      proc_plan: remark,
      proc_real: proc_stream_name,
      rec_time,
      check_type,
      task_id
    };
  });
  await db.addPrintWmsProclist(insertData);
};

// 人工拉号,默认设为人工异常品拉号，人工拉号时需锁定车号信息。
let manualHandle = async (carnos, reason_code = "q_abnormalProd") =>
  await wms.setBlackList({ carnos, reason_code });

// 码后工艺验证
let mahouProcVerify = async carnos => {
  return 1;
};

// 设置工艺流程至立体库
let adjustProcInfo = async ({
  proc_stream,
  proc_stream_name,
  carnos,
  reason_code
}) => {
  let result;
  // 全检品、补品、码后核查，直接设置到对应工艺
  if ([0, 2, 4, 6].includes(proc_stream)) {
    result = await wms.setProcs({ carnos, checkType: proc_stream_name });
  } else if ([3, 5].includes(proc_stream)) {
    // 码后工艺验证
    result = await mahouProcVerify(carnos);
  } else {
    // 人工拉号锁车
    result = await manualHandle(carnos, reason_code);
  }
  consola.success(result);

  // 记录日志信息，wms提交及返回的数据全部入库
  await db.addPrintWmsLog([
    {
      remark: JSON.stringify({ carnos, proc_stream }),
      rec_time: lib.now(),
      return_info: JSON.stringify(result)
    }
  ]);
  return result;
};

/**
 * @desc:调整工艺流程
 * 流程中的数据库交互流程如下：
 * 1.工艺流程调整信息入立体库
 * 2.处理入库成功的车号列表记录实际工艺，处理失败的车号列表不记录
 */
let handleProcStream = async ({
  carnos,
  proc_stream,
  check_type,
  reason_code,
  task_id
}) => {
  if (carnos.length === 0) {
    return { status: false };
  }

  // 工艺流转换
  let { proc_stream_name, remark } = getProcStream(proc_stream);

  // 设置工艺流程至立体库
  let res = await adjustProcInfo({
    carnos,
    proc_stream_name,
    proc_stream,
    reason_code
  });

  console.log(res);
  if (!res.status) {
    return res;
  }

  let { result } = res;
  console.log(
    "立体库返回信息,失败车数：" +
      result.unhandledList.length +
      ",成功车数：" +
      result.handledList.length
  );

  if (result.handledList) {
    if (R.type(result.handledList[0]) === "Object") {
      // 处理成功的车号列表，[Object,Object] -> [String,String]
      // 测试环境测未部署
      result.handledList = R.map(R.prop("carno"))(result.handledList);
    }

    // 记录实际工艺
    await recordRealProc(
      result.handledList, // carnos
      proc_stream_name,
      remark,
      check_type,
      task_id
    );
  }

  return res;
};

const recordHeartbeat = async task_name => {
  consola.success("i am alive :)");
  let { data } = await db.getPrintWmsHeartbeat();
  let isFind = R.filter(R.propEq("task_name", task_name))(data);
  if (isFind.length) {
    // 更新服务心跳
    return await db.setPrintWmsHeartbeat({ rec_time: lib.now(), task_name });
  } else {
    // 记录服务心跳
    return await db.addPrintWmsHeartbeat({ rec_time: lib.now(), task_name });
  }
};

module.exports = {
  handleProcStream,
  recordHeartbeat
};
