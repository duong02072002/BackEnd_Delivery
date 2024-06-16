const db = require('../config/config');

const OrderHasProducts = {};



OrderHasProducts.create = (id_order, id_product, quantity, result) => {

    const sql = `
    INSERT INTO
        order_has_products(
            id_order,
            id_product,
            quantity,
            created_at,
            updated_at   
        )
    VALUES(?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            id_order,
            id_product,
            quantity,
            new Date(),
            new Date(),
        ],
        (err, res) => {
            if (err) {
                console.log('Error:', err);
                result(err, null);
            }
            else {
                console.log('Id of the new order_has_products:', res.insertId);
                result(null, res.insertId);
            }
        }

    )


}

OrderHasProducts.getTotalSales = (callback) => {
    const sql = `
        SELECT
            SUM(ohp.quantity) AS total_quantity_sold,
            SUM(ohp.quantity * p.price) AS total_sales_amount
        FROM
            orders o
            JOIN order_has_products ohp ON o.id = ohp.id_order
            JOIN products p ON ohp.id_product = p.id
        WHERE
            o.status = 'DELIVERED'
    `;

    db.query(sql, (err, result) => {
        if (err) {
            return callback(err, null);
        }

        // Nếu không có kết quả, trả về 0
        const totalQuantitySold = result.length > 0 ? result[0].total_quantity_sold : 0;
        const totalSalesAmount = result.length > 0 ? result[0].total_sales_amount : 0;

        callback(null, {
            total_quantity_sold: totalQuantitySold,
            total_sales_amount: totalSalesAmount
        });
    });
};


module.exports = OrderHasProducts;