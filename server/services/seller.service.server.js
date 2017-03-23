module.exports = function (db, dbQuery) {

    return {
        createItem: createItem,
        listItems: listItems,
        editItem: editItem,
        deleteItem: deleteItem,
        listOrders: listOrders,
    };

    function createItem(req, res) {
        let role = req.params.uid;
        let item = req.body;
        let query, values;
        query = "insert into `Item` "
            + "(`name`, `price`, `quantity`, `description`, `seller`, `order`) "
            + "values (?,?,?,?,?,?)";
        values = [item.name, item.price, item.quantity, item.description, role, item.order];
        dbQuery(query, values, res);
    }

    function listItems(req, res) {
        let role = req.params.uid;
        let query, values;
        query = "select `id`,`name`,`price`,`quantity`,`description` from Item "
            + "where `seller`=? and `order` is null";
        values = [role];
        dbQuery(query, values, res);
    }

    function editItem(req, res) {
        let role = req.params.uid;
        let itemID = req.params.iid;
        let item = req.body;
        let query, values;
        query = "update `Item` set "
            + "`name=?`, `price`=?, `quantity`=?, `description`=? "
            + "where `id`=? and `seller`=? and `order` is null";
        values = [item.name, item.price, item.quantity, item.description, itemID, role];
        dbQuery(query, values, res);
    }

    function deleteItem(req, res) {
        let role = req.params.uid;
        let itemID = req.params.iid;
        let query, values;
        query = "delete from `Item` where `id`=? and `seller`=? and `order` is null";
        values = [itemID, role];
        dbQuery(query, values, res);
    }

    function listOrders(req, res) {
        let role = req.params.uid;
        let query, values;
        query = "select `id`,`createTime`,`address`,`buyer` from `Order` as o "
            + "where exists( "
            + "select * from `Item` as i "
            + "where o.`id`=i.`order` and i.`seller`=?"
            + ")";
        values = [role];
        dbQuery(query, values, res);
    }
};