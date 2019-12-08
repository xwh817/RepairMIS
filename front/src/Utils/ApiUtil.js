/**
 * 对api访问地址进行管理
 */
export default class ApiUtil {
    static URL_IP = 'http://127.0.0.1:5000';
    static URL_ROOT = '/api/v1';

    static API_GET_PARTS = ApiUtil.URL_ROOT + '/getParts/';

    static API_GET_REPAIR_ITEMS = ApiUtil.URL_ROOT + '/getRepairItems/';


}