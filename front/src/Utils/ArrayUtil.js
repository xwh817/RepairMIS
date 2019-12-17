
/**
 * 保存公共常用的变量
 */
export default class ArrayUtil {

    static getItemIndex(array, id) {
        let index = -1;
        for (let i = 0; i < array.length; i++) {
            if (array[i].id === id) {
                index = i;
                break;
            }
        }
        return index;
    }

    static replaceItem(array, item) {
        let index = this.getItemIndex(array, item.id);
        if (index >= 0) {
            item.index = array[index].index;
            array[index] = item;
        }
    }

    static deleteItem(array, id) {
        let index = this.getItemIndex(array, id);
        if (index >= 0) {
            // splice操作之后，array中index，howmany的对象被删除
            // 注意：splice函数返回的是删掉的元素
            array.splice(index, 1);
        }
        return array;
    }
    
}