import fs from 'fs'
import PDFDocument from 'pdfkit'

export const pdfService = {
    buildBugsPDF,
}


function buildBugsPDF(bugs, filename = 'SaveTheBugs.pdf') {
    const doc = new PDFDocument()
    doc.pipe(fs.createWriteStream(filename))

    bugs.forEach((bug, idx) => {
        doc.text(`Bug ID: ${bug._id}`)
        doc.text(`Title: ${bug.title}`)
        doc.text(`Description: ${bug.description}`)
        doc.text(`🐛`)
        doc.text(`Severity: ${bug.severity}`)


        // const imgMargin = 10
        // const heightLeft = doc.page.height - doc.y - (imgMargin * (bug.imgUrls.length + 1))
        // const imgHeight = heightLeft / bug.imgUrls.length

        // const imgHeight = 200
        // const imgMargin = 10
        // let currentY = doc.y + imgMargin
        // bug.imgUrls.forEach((_, imgIdx) => {
        //     doc.image(`img/${bug.title}${imgIdx}.jpg`, { height: imgHeight, y: currentY })
        //     currentY += imgHeight + imgMargin
        // })

        idx < bugs.length - 1 && doc.addPage()
    })

    doc.end()
}