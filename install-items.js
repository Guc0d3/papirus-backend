const accountings = [
  { companyId: -1, code: '1101', name: 'Cash', isSafe: true },
  { companyId: -1, code: '1201', name: 'Bank', isSafe: true },
  { companyId: -1, code: '1301', name: 'Receivable', isSafe: true },
  { companyId: -1, code: '1401', name: 'Inventory', isSafe: true },
  { companyId: -1, code: '1501', name: 'Undue Input VAT', isSafe: true },
  {
    companyId: -1,
    code: '1601',
    name: 'Accumulated Depreciation',
    isSafe: true
  },
  { companyId: -1, code: '2101', name: 'Payable', isSafe: true },
  { companyId: -1, code: '2201', name: 'VAT Payable', isSafe: true },
  {
    companyId: -1,
    code: '2301',
    name: 'Withholding Tax Payable',
    isSafe: true
  },
  { companyId: -1, code: '3101', name: 'Capital', isSafe: true },
  {
    companyId: -1,
    code: '3201',
    name: 'Accumulate Profit',
    isSafe: true
  },
  { companyId: -1, code: '3301', name: 'Dividend', isSafe: true },
  { companyId: -1, code: '4101', name: 'Revenue', isSafe: true },
  { companyId: -1, code: '4201', name: 'Interest', isSafe: true },
  {
    companyId: -1,
    code: '5101',
    name: 'Cost of good sold',
    isSafe: true
  },
  { companyId: -1, code: '5201', name: 'Purchases', isSafe: true },
  {
    companyId: -1,
    code: '5301',
    name: 'Purchase Discounts',
    isSafe: true
  },
  { companyId: -1, code: '5401', name: 'Salary', isSafe: true },
  { companyId: -1, code: '5501', name: 'Advertisement', isSafe: true },
  {
    companyId: -1,
    code: '5601',
    name: 'Utility Expense',
    isSafe: true
  },
  { companyId: -1, code: '5701', name: 'Bank Fees', isSafe: true },
  {
    companyId: -1,
    code: '5702',
    name: 'Interest Payable',
    isSafe: true
  },
  { companyId: -1, code: '5801', name: 'Depreciation', isSafe: true },
  { companyId: 1, code: '1101', name: 'เงินสด', isSafe: true },
  { companyId: 1, code: '1201', name: 'เงินฝากธนาคาร', isSafe: true },
  { companyId: 1, code: '1301', name: 'ลูกหนี้การค้า', isSafe: true },
  { companyId: 1, code: '1401', name: 'สินค้าคงเหลือ', isSafe: true },
  {
    companyId: 1,
    code: '1501',
    name: 'ภาษีซื้อยังไม่ถึงกำหนดชำระ',
    isSafe: true
  },
  {
    companyId: 1,
    code: '1601',
    name: 'ค่าเสื่อมราคาสะสม',
    isSafe: true
  },
  { companyId: 1, code: '2101', name: 'เจ้าหนี้การค้า', isSafe: true },
  { companyId: 1, code: '2201', name: 'ภาษีขาย', isSafe: true },
  {
    companyId: 1,
    code: '2301',
    name: 'ภาษีเงินได้หัก ณ ที่จ่าย',
    isSafe: true
  },
  { companyId: 1, code: '3101', name: 'ทุน', isSafe: true },
  { companyId: 1, code: '3201', name: 'กำไรสะสม', isSafe: true },
  { companyId: 1, code: '3301', name: 'เงินปันผล', isSafe: true },
  { companyId: 1, code: '4101', name: 'รายได้', isSafe: true },
  { companyId: 1, code: '4201', name: 'ดอกเบี้ย', isSafe: true },
  { companyId: 1, code: '5101', name: 'ต้นทุนการขาย', isSafe: true },
  { companyId: 1, code: '5201', name: 'ซื้อสินค้า', isSafe: true },
  { companyId: 1, code: '5301', name: 'ส่วนลด', isSafe: true },
  { companyId: 1, code: '5401', name: 'เงินเดือน', isSafe: true },
  { companyId: 1, code: '5501', name: 'ค่าโฆษณา', isSafe: true },
  { companyId: 1, code: '5601', name: 'รายจ่ายสำนักงาน', isSafe: true },
  {
    companyId: 1,
    code: '5701',
    name: 'ค่าธรรมเนียมธนาคาร',
    isSafe: true
  },
  { companyId: 1, code: '5702', name: 'ดอกเบี้ยจ่าย', isSafe: true },
  { companyId: 1, code: '5801', name: 'ค่าเสื่อมราคา', isSafe: true }
]

const companies = [
  {
    code: 'CP01',
    name: 'บริษัท เริ่มต้น จำกัด',
    address: null,
    phone: null,
    taxCode: null,
    avatar: null,
    isActive: true
  }
]

const contacts = [
  {
    companyId: 1,
    code: 'CT01',
    name: 'ลูกค้าทั่วไป',
    address: null,
    phone: null,
    taxCode: null,
    prefix: null,
    avatar: null
  }
]

module.exports = {
  accountings,
  companies,
  contacts
}
