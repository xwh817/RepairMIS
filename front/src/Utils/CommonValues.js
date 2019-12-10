
/**
 * 保存公共常用的变量
 */
export default class CommonValues {
    static JOBS = [];

    static userTypes = [
        {
            id: 1,
            name: "系统管理员"
        },
        {
            id: 2,
            name: "出单员"
        },
        {
            id: 4,
            name: "工程师"
        }
    ];

    static partTypes = [
      { index:1, id: 1, name: "电器部分" },
      { index:2, id: 2, name: "液压部分" },
      { index:3, id: 3, name: "其他易损件部分" }
    ];
}