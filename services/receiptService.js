const PDFDocument=require('pdfkit');
const fs=require('fs');
const path=require('path');

//function to generate receipts pdf using pdfkit
const generateReceipt=async(orderData,outputPath)=>{
    //define the pdf
    const doc=new PDFDocument({
        size:'LETTER',
        margin:{top:50,bottom:50,left:50,right:50}
    });
    //stream to save file to avoid crash on large files
    const writeStream=fs.createWriteStream(outputPath);
    doc.pipe(writeStream);

    //pdf contents 
    //1.COMPANY DETAILS
    doc.fontSize(24)
       .fillColor('#2C3E50')
       .font('Helvetica-Bold')
       .text('NEHEMIA ONYANGO GENERAL STORES', { align: 'center' });

    doc.fontSize(10)
       .fillColor('#7F8C8D')
       .font('Helvetica')
       .text('0100-GPO EMBAKASI, NAIROBI, KENYA', { align: 'center' })
       .text('Phone: +254 707877483 | Email: onyangogeneral.co.ke', { align: 'center' })
       .moveDown(2);
    
    //2.RECEIPT 
    doc.fontSize(18)
       .fillColor('#2C3E50')
       .font('Helvetica-Bold')
       .text('ORDER DETAILS', { align: 'center' })
       .moveDown(1);
    
    doc.strokeColor('#BDC3C7')
       .lineWidth(1)
       .moveTo(50, doc.y)
       .lineTo(550, doc.y)
       .stroke()
       .moveDown(1);
    
    //3.RECEIPT CONTENTS
    const orderInfoY = doc.y;
        doc.fontSize(10)
       .fillColor('#2C3E50')
       .font('Helvetica-Bold')
       .text('Bill To:', 50, orderInfoY);
    
    doc.font('Helvetica')
       .text(orderData.customer_name, 50, doc.y)
       .text(orderData.customer_email, 50, doc.y);
    
        const rightColumnX = 350;
    doc.font('Helvetica-Bold')
       .text('Receipt No:', rightColumnX, orderInfoY, { width: 100 })
       .font('Helvetica')
       .text(`#${orderData.order_id}`, rightColumnX + 100, orderInfoY);

    doc.font('Helvetica-Bold')
       .text('Date:', rightColumnX, doc.y, { width: 100 })
       .font('Helvetica')
       .text(formatDate(orderData.order_datetime), rightColumnX + 100, doc.y - 12);

    doc.font('Helvetica-Bold')
       .text('Payment Method:', rightColumnX, doc.y, { width: 100 })
       .font('Helvetica')
       .text(orderData.payment_method, rightColumnX + 100, doc.y - 12);

    doc.moveDown(2);

    //4.TABLE TO LIST ORDER ITEMS
    const tableTop = doc.y;
    const itemCodeX = 50;
    const descriptionX = 150;
    const quantityX = 350;
    const priceX = 420;
    const amountX = 490;
    
    //4.1  TABLE HEADING
    doc.fillColor('#34495E')
       .fontSize(10)
       .font('Helvetica-Bold');

    doc.text('Item', itemCodeX, tableTop)
       .text('Description', descriptionX, tableTop)
       .text('Qty', quantityX, tableTop)
       .text('Price', priceX, tableTop)
       .text('Amount', amountX, tableTop);

    //4.2 LINE SEPARATER TO MAKE IT LOOK NEAT
    doc.strokeColor('#BDC3C7')
       .lineWidth(1)
       .moveTo(50, tableTop + 15)
       .lineTo(550, tableTop + 15)
       .stroke();

    //4.3ITEMS 
        let yPosition = tableTop + 25;
    doc.font('Helvetica')
       .fontSize(9)
       .fillColor('#2C3E50');

    orderData.items.forEach((item, index) => {
        const quantity = item.qty || item.quantity || 0;
        const price = item.price || 0;
        const itemTotal = quantity * price;
        
        doc.text(index + 1, itemCodeX, yPosition)
         .text(item.name || 'Unknown Item', descriptionX, yPosition)
         .text(quantity.toString(), quantityX, yPosition)  
         .text(`KES ${price.toFixed(2)}`, priceX, yPosition)
         .text(`KES ${itemTotal.toFixed(2)}`, amountX, yPosition);

        yPosition += 20;
    });

    //5.ANOTHER LINE SEPARETOR
    doc.strokeColor('#BDC3C7')
       .lineWidth(1)
       .moveTo(50, yPosition)
       .lineTo(550, yPosition)
       .stroke();

    //6. TOTALS
    yPosition += 15;
    const totalsX = 420;

    doc.fontSize(10)
       .font('Helvetica');

    //6.1 SUBTOTAL SECTION
    doc.text('Subtotal:', totalsX, yPosition)
       .text(`KES ${parseFloat(orderData.subtotal).toFixed(2)}`, amountX, yPosition);
    yPosition += 20;

    //6.2 DISCOUNT IF ANY
    doc.text('Discount:', totalsX, yPosition)
       .text(`-KES ${parseFloat(orderData.discount).toFixed(2)}`, amountX, yPosition);
    yPosition += 20;

    doc.strokeColor('#BDC3C7')
       .lineWidth(1)
       .moveTo(totalsX - 10, yPosition)
       .lineTo(550, yPosition)
       .stroke();
    yPosition += 10;

    //6.3 TOTAL OF THE ITEMS
    doc.fontSize(12)
       .font('Helvetica-Bold')
       .fillColor('#27AE60')
       .text('Total:', totalsX, yPosition)
       .text(`KES ${parseFloat(orderData.total_amount).toFixed(2)}`, amountX, yPosition);
    
    //FOOTER OF THE RECEIPT
doc.moveDown(3);
doc.fontSize(9)
   .fillColor('#7F8C8D')
   .font('Helvetica-Oblique')
   .text('Thank you for Shopping with us!!!', 50, doc.y, { 
       width: 500, 
       align: 'center' 
   })
   .moveDown(0.5)
   .text('For any queries, please contact us at support@onyangogenerals.com', 50, doc.y, { 
       width: 500, 
       align: 'center' 
   })
   .moveDown(1);

doc.fontSize(7)
   .fillColor('#95A5A6')
   .font('Helvetica')
   .text('GOODS ONCE SOLD CANNOT BE RETURNED.', 50, doc.y, { 
       width: 500, 
       align: 'center' 
   })
   .text('Please retain this receipt for your records and future references.', 50, doc.y, { 
       width: 500, 
       align: 'center' 
   });

    
    doc.end();
    await new Promise((resolve, reject) => {
        writeStream.on('finish', resolve);
        writeStream.on('error', reject);
    });
    //ouput path
    return outputPath;


};

const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return date.toLocaleDateString('en-US', options);
};

module.exports={generateReceipt};