let { axios } = require("./axios");

/**
*   @database: { 质量信息系统 }
*   @desc:     { 未完成的全检任务计划列表 } 

  2018-04-11 更新
  SELECT a.id,a.date_type,a.machine_name,a.proc_name,b.ProductName,a.reason,isnull(a.num1,0) num1,isnull(a.num2,0) num2,a.proc_stream1,a.proc_stream2,CONVERT (VARCHAR,a.rec_date1,112) rec_date1,CONVERT (VARCHAR,a.rec_date2,112) rec_date2,a.complete_num,a.complete_status,a.alpha_num FROM dbo.print_newproc_plan AS a INNER JOIN ProductData b on a.prod_id = b.ProductID WHERE a.complete_status = 0
*/
const getPrintNewprocPlan = async () =>
  await axios({
    url: "/78/b36aab89f7.json"
  }).then(res => res);

const getCartList = async ({ machine_name, rec_date1 }) => {
  let arr = [];
  for (let i = 100; i < 200; i++) {
    arr.push(`1620A${i}`);
  }
  return arr;
};

const getCartListWithDate = async ({ machine_name, rec_date1, rec_date2 }) => {
  let arr = [];
  for (let i = 100; i < 200; i++) {
    arr.push(`1620A${i}`);
  }
  return arr;
};

const getCartListWithGZ = async ({ prod_name, gz, start_no, end_no }) => {
  let arr = [];
  for (let i = 100; i < 200; i++) {
    arr.push(`1620A${i}`);
  }
  return arr;
};

/**
*   @database: { 质量信息系统 }
*   @desc:     { 更新四新计划状态信息 } 
	以下参数在建立过程中与系统保留字段冲突，已自动替换:
	@id:_id. 参数说明：api 索引序号
  
    const { complete_num, complete_status, update_time, _id } = params;
*/
const setPrintNewprocPlan = async params =>
  await axios({
    url: "/90/a6c66f8d72.json",
    params
  }).then(res => res);

/**
*   @database: { 质量信息系统 }
*   @desc:     { 批量记录库管系统日志信息 } 
	以下参数在建立过程中与系统保留字段冲突，已自动替换:
	@desc:批量插入数据时，约定使用二维数组values参数，格式为[{remark,rec_time,return_info }]，数组的每一项表示一条数据*/
const addPrintWmsLog = async values =>
  await axios({
    method: "post",
    data: {
      values,
      id: 91,
      nonce: "f0500427cb"
    }
  }).then(res => res);

/**
*   @database: { 质量信息系统 }
*   @desc:     { 批量批量插入立体库四新计划工艺流转信息 } 
	以下参数在建立过程中与系统保留字段冲突，已自动替换:
	@desc:批量插入数据时，约定使用二维数组values参数，格式为[{cart_number,gz_num,proc_plan,proc_real,rec_time }]，数组的每一项表示一条数据*/
const addPrintWmsProclist = async values =>
  await axios({
    method: "post",
    data: {
      values,
      id: 92,
      nonce: "db02022755"
    }
  }).then(res => res);

/**
 *   @database: { 质量信息系统 }
 *   @desc:     { 未处理的异常品列表 }
 */
const getPrintAbnormalProd = async () =>
  await axios({
    url: "/93/ba126b61bf.json"
  }).then(res => res);

/**
 *   @database: { 质量信息系统 }
 *   @desc:     { 记录异常品任务处理状态 }
 */
const setPrintAbnormalProd = async cart_number =>
  await axios({
    url: "/94/ae030c585f.json",
    params: {
      cart_number
    }
  }).then(res => res);

/**
*   @database: { 质量信息系统 }
*   @desc:     { 更新NodeJS 服务心跳 } 
    const { rec_time, task_name } = params;
*/
const addPrintWmsHeartbeat = async params =>
  await axios({
    url: "/95/eb4416dc92.json",
    params
  }).then(res => res);

/**
 *   @database: { 质量信息系统 }
 *   @desc:     { 查询NodeJS 服务心跳 }
 */
const getPrintWmsHeartbeat = async () =>
  await axios({
    url: "/96/8d7c52c835.json"
  }).then(res => res);
/**
*   @database: { 质量信息系统 }
*   @desc:     { 更新Nodejs 服务心跳 } 
    const { rec_time, task_name } = params;
*/
const setPrintWmsHeartbeat = async params =>
  await axios({
    url: "/97/c7677a2271.json",
    params
  }).then(res => res);

/**
 *   @database: { 质量信息系统 }
 *   @desc:     { 自动排活待处理列表 }
 */
const getPrintSampleCartlist = async () =>
  await axios({
    url: "/98/8832903756.json"
  }).then(res => res);

/**
 *   @database: { 质量信息系统 }
 *   @desc:     { 连续废通知未生产完毕车号列表 }
 */
const getPrintMachinecheckMultiweak = async () =>
  await axios({
    url: "/99/4c9141bdd3.json"
  }).then(res => res);

/**
*   @database: { 机台作业 }
*   @desc:     { 车号最近生产工序 } 
    const { cart1, cart2 } = params;
*/
const getViewCartfinder = async params =>
  await axios({
    url: "/100/97cfc715f4.json",
    params
  }).then(res => res);

/**
*   @database: { 质量信息系统 }
*   @desc:     { 更新连续废通知产品生产进度信息 } 
	以下参数在建立过程中与系统保留字段冲突，已自动替换:
	@id:_id. 参数说明：api 索引序号
    const { last_proc, last_machine, last_rec_time, _id } = params;
*/
const setPrintMachinecheckMultiweak = async params =>
  await axios({
    url: "/101/f4f2a8ef0f.json",
    params
  }).then(res => res);

/**
*   @database: { 质量信息系统 }
*   @desc:     { 根据id信息查询连续废通知情况 } 
	以下参数在建立过程中与系统保留字段冲突，已自动替换:
	@id:_id. 参数说明：api 索引序号
      */
const getPrintMachinecheckMultiweakById = async _id =>
  await axios({
    url: "/102/66373f0467.json",
    params: {
      _id
    }
  }).then(res => res);

/**
*   @database: { 质量信息系统 }
*   @desc:     { 连续废通知产品已完工 } 
	以下参数在建立过程中与系统保留字段冲突，已自动替换:
	@id:_id. 参数说明：api 索引序号
      */
const setPrintMachinecheckMultiweakStatus = async _id =>
  await axios({
    url: "/103/1db66c49a0.json",
    params: {
      _id
    }
  }).then(res => res);

module.exports = {
  getPrintNewprocPlan,
  getCartList,
  getCartListWithDate,
  getCartListWithGZ,
  setPrintNewprocPlan,
  addPrintWmsLog,
  setPrintNewprocPlan,
  addPrintWmsLog,
  addPrintWmsProclist,
  getPrintAbnormalProd,
  setPrintAbnormalProd,
  addPrintWmsHeartbeat,
  getPrintWmsHeartbeat,
  setPrintWmsHeartbeat,
  getPrintSampleCartlist,
  getPrintMachinecheckMultiweak,
  getViewCartfinder,
  setPrintMachinecheckMultiweak,
  getPrintMachinecheckMultiweakById,
  setPrintMachinecheckMultiweakStatus
};
