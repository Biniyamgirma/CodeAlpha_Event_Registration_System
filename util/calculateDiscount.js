
function calculateDiscount(percentage,totalAmount){
    const discountAmount = (percentage/100)*totalAmount;
    return discountAmount;
}
function calculateTax(percentage,totalAmount){
    const taxAmount = (percentage/100)*totalAmount;
    return taxAmount;
}

module.exports = {calculateDiscount,calculateTax};