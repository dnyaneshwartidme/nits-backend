import ExcelJS from 'exceljs';
import path from 'path';
import fs from 'fs';

const generateActiveStudentExcel = async () => {
    const folderPath = path.join(process.cwd(), 'src', 'components', 'nits_admin', 'active_studant_pregenty');
    
    // Ensure the folder exists
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
    }

    const filePath = path.join(folderPath, 'active_students_live.xlsx');
    
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Live Attendance');

    // Add some basic placeholder headers so the user can tell me what to fill
    worksheet.columns = [
        { header: 'ID', key: 'id', width: 15 },
        { header: 'Name', key: 'name', width: 32 },
        { header: 'Status', key: 'status', width: 15 }
    ];

    worksheet.getRow(1).font = { bold: true };
    
    await workbook.xlsx.writeFile(filePath);
    console.log(`✅ File created at: ${filePath}`);
};

generateActiveStudentExcel();
