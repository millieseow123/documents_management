import 'dotenv/config';
import { db } from "@/lib/db";

(async function seed() {
  const entries: [string, string, string, string, string][] = [
    ["Appointment resolutions", "folder", "John Green", "15 Jan 2025", "-"],
    ["Policy approvals", "folder", "John Green", "10 Jan 2025", "-"],
    ["2025_01_15_Director_Appointment_Resolution.pdf", "file", "John Green", "15 Jan 2025", "3.3 KB"],
    ["2024_12_10_Dividend_Declaration_Resolution.docx", "file", "John Green", "10 Dec 2024", "4.4 KB"],
    ["2023_08_05_Investment_Policy_Approval.pdf", "file", "John Green", "05 Aug 2023", "2.9 KB"],
    ["Meeting Minutes", "folder", "John Green", "20 Nov 2024", "-"],
    ["2024_09_01_Quarterly_Review_Minutes.pdf", "file", "User 7", "01 Sep 2024", "4.1 KB"],
    ["Strategy Planning", "folder", "User 8", "10 Oct 2024", "-"],
    ["2024_10_15_Strategy_Plan_Draft.docx", "file", "User 9", "15 Oct 2024", "3.5 KB"],
    ["Audit Reports", "folder", "User 10", "02 Mar 2024", "-"],
    ["2024_03_02_Internal_Audit_Summary.pdf", "file", "User 11", "02 Mar 2024", "4.0 KB"],
    ["Employee Docs", "folder", "User 12", "12 Jul 2024", "-"],
    ["2024_07_12_Employee_Handbook_Update.docx", "file", "User 13", "12 Jul 2024", "3.8 KB"],
    ["Legal Files", "folder", "User 14", "08 Feb 2023", "-"],
    ["2023_02_08_Legal_Compliance_Form.pdf", "file", "User 15", "08 Feb 2023", "2.7 KB"],
    ["2023_03_12_Tax_Compliance_Checklist.docx", "file", "User 16", "12 Mar 2023", "3.6 KB"],
    ["Finance", "folder", "User 17", "01 Apr 2024", "-"],
    ["2024_04_01_Annual_Financial_Report.pdf", "file", "User 18", "01 Apr 2024", "5.1 KB"],
    ["2023_05_05_Expense_Report_Q2.xlsx", "file", "User 19", "05 May 2023", "3.2 KB"],
    ["HR Records", "folder", "User 20", "01 Jun 2023", "-"],
    ["2023_06_01_New_Hires_Overview.docx", "file", "User 21", "01 Jun 2023", "3.9 KB"],
    ["2023_07_14_Training_Schedule.pdf", "file", "User 22", "14 Jul 2023", "3.5 KB"],
    ["Board Meetings", "folder", "User 23", "25 Dec 2023", "-"],
    ["2023_12_25_Board_Meeting_Notes.pdf", "file", "User 24", "25 Dec 2023", "4.2 KB"],
    ["Product Planning", "folder", "User 25", "18 Aug 2024", "-"],
    ["2024_08_18_Product_Launch_Timeline.docx", "file", "User 26", "18 Aug 2024", "3.6 KB"],
    ["2024_11_30_Design_Documentation.pdf", "file", "User 27", "30 Nov 2024", "4.0 KB"],
    ["2023_09_10_Marketing_Plan.pdf", "file", "User 28", "10 Sep 2023", "2.8 KB"],
    ["2023_10_22_Campaign_Results.xlsx", "file", "User 29", "22 Oct 2023", "3.3 KB"],
    ["2023_01_03_Year_Start_Notes.docx", "file", "User 30", "03 Jan 2023", "3.1 KB"],
  ];

  try {
    await Promise.all(
      entries.map((entry) =>
        db.query(
          "INSERT INTO documents (name, type, createdBy, date, size) VALUES (?, ?, ?, ?, ?)",
          entry
        )
      )
    );
    console.log("Seeding complete");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
})();
