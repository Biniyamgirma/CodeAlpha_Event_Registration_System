const pool = require('../database/connection')

const invoiceNumberGenerator = (prifix,tableName,columnName)=>{

    pool.query(`SELECT MAX(${columnName}) FROM ${tableName}`).then(result=>{
        if(result.rows[0].max){
            return prifix + result.rows[0].max;
        }else{
            throw error;
            
        }
})
}
function generateInvoiceNumber(){
    return invoiceNumberGenerator ('INV-','invoices','invoice_id')
}
module.exports = {
    generateInvoiceNumber
}