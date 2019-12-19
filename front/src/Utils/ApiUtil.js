/**
 * 对api访问地址进行管理
 */
export default class ApiUtil {
    static URL_IP = 'http://127.0.0.1:5000';
    static URL_ROOT = '/api/v1';

    static API_GET_USERS = ApiUtil.URL_ROOT + '/getUsers/';
    static API_USER_UPDATE = ApiUtil.URL_ROOT + '/updateUser';
    static API_USER_DELETE = ApiUtil.URL_ROOT + '/deleteUser/';

    static API_GET_PARTS = ApiUtil.URL_ROOT + '/getParts/';
    static API_PART_UPDATE = ApiUtil.URL_ROOT + '/updatePart';
    static API_PART_DELETE = ApiUtil.URL_ROOT + '/deletePart/';

    static API_GET_REPAIR_ITEMS = ApiUtil.URL_ROOT + '/getRepairItems/';
    static API_REPAIR_ITEM_UPDATE = ApiUtil.URL_ROOT + '/updateRepairItem';
    static API_REPAIR_ITEM_DELETE = ApiUtil.URL_ROOT + '/deleteRepairItem/';

    // 门店信息
    static API_GET_STORE = ApiUtil.URL_ROOT + '/getStore/';
    static API_STORE_UPDATE = ApiUtil.URL_ROOT + '/updateStore';

    // 订单
    static API_GET_ORDERS = ApiUtil.URL_ROOT + '/getOrders';
    static API_ORDER_UPDATE = ApiUtil.URL_ROOT + '/updateOrder';
    static API_ORDER_DELETE = ApiUtil.URL_ROOT + '/deleteOrder/';
    static API_ORDER_SEARCH = ApiUtil.URL_ROOT + '/searchOrder';
    
}