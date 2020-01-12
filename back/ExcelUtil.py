import openpyxl
from openpyxl.styles import Font, Border, Side
from openpyxl.styles import Alignment
import SqliteUtil
import json

mywb = openpyxl.Workbook()
mysheet = mywb.active   # 当前活动的sheet
boldFont = Font(size=12, bold=True)
textFont = Font(size=12)
alignCenter = Alignment(horizontal='center',vertical='center',wrap_text=True)
thin_border = Border(left=Side(style='thin'), right=Side(style='thin'), top=Side(style='thin'), bottom=Side(style='thin'))
currentRow = 1
orderInfo = {}
storeInfo= {}

def init():
    print('init')
    #mysheet.font = textFont
    #mysheet.column_dimensions['E'].font = textFont
    # 设置行列的宽高
    mysheet.row_dimensions[1].height = 60
    mysheet.column_dimensions['A'].width = 16

def setBorder():
    rows = mysheet.iter_rows()
    for row in rows:
        for cell in row:
            cell.border = thin_border

def setText(cell, text, isBold=False, isCenter=True):
    mysheet[cell] = text
    #mysheet[cell].border = thin_border
    if isCenter:
        mysheet[cell].alignment = alignCenter   
    if isBold:
        mysheet[cell].font = boldFont
    else:
        mysheet[cell].font  = textFont

def setTextRange(cell_range, text, isBold=False, isCenter=True):
    mysheet.merge_cells(cell_range)
    setText(cell_range.split(':')[0], text, isBold=isBold, isCenter=isCenter)

def setRowHeight(row, height):
    mysheet.row_dimensions[row].height = height


def buildExcel(id):
    global orderInfo
    global storeInfo
    global currentRow
    currentRow = 1
    orderInfo = SqliteUtil.getOrderById(id)
    storeInfo = SqliteUtil.getStore(1, isJson=False)
    init()
    buildTitle()
    buildClientInfo()
    buildStoreInfo()
    #mysheet.column_dimensions['E'].font = textFont
    
    buildRepairItems()
    buildParts()
    # 对前面已经构建好的内容设置边框，例如后面的footer就没有边框。
    #setBorder(mysheet, "A1:H10")
    setBorder()
    buildFooter()
    fileName = '%s.xlsx' % orderInfo['sn']
    mywb.save('./excel/%s' % fileName)
    print(fileName)
    return fileName

def buildTitle():
    global storeInfo
    global currentRow
    setTextRange('A1:H1', '%s维修清单' %(storeInfo['name']), isBold=True)
    currentRow += 1

def buildClientInfo():
    global currentRow
    global orderInfo
    print('orderInfo: %s' % orderInfo['create_time'])
    startRow = currentRow
    mysheet.merge_cells('A%d:E%d' % (startRow, startRow+1))
    setText('F%d' % startRow, '维修订单号')
    setText('F%d' % (startRow+1), '日期')
    setTextRange('G%d:H%d' %(startRow, startRow), orderInfo['sn'])
    setTextRange('G%d:H%d' %(startRow+1, startRow+1), orderInfo['create_time'].split(' ')[0])

    setTextRange('A%d:H%d' %(startRow+2, startRow+2), '客户信息', isBold=True)
    setRowHeight(startRow+2, 30)

    setText('A%d' % (startRow+3), '客户名称')
    setTextRange('B%d:D%d' %(startRow+3, startRow+3), orderInfo['client_name'])

    setTextRange('E%d:F%d' % (startRow+3, startRow+3), '客户联系人及电话')
    setTextRange('G%d:H%d' %(startRow+3, startRow+3), orderInfo['client_user'] + '    ' + orderInfo['client_phone'])

    setText('A%d' % (startRow+4), '型号')
    setTextRange('B%d:D%d' %(startRow+4, startRow+4), orderInfo['client_phone'])

    setTextRange('E%d:F%d' % (startRow+4, startRow+4), '车牌号码')
    setTextRange('G%d:H%d' %(startRow+4, startRow+4), orderInfo['client_sn'])

    currentRow += 5


def buildStoreInfo():
    global storeInfo
    global currentRow
    startRow = currentRow

    #print(storeInfo)
    setTextRange('A%d:A%d' %(startRow, startRow+1), '地址/电话')
    setTextRange('B%d:H%d' %(startRow, startRow), 'Test', isCenter=False)
    setTextRange('B%d:H%d' %(startRow+1, startRow+1), '联系人：%s    电话：%s' %(storeInfo['user'], storeInfo['phone']), isCenter=False)

    currentRow += 2


def buildRepairItems():
    global currentRow
    global orderInfo
    startRow = currentRow
    setTextRange('A%d:H%d' %(startRow, startRow), '维修内容', isBold=True)
    setRowHeight(startRow, 30)

    startRow+=1
    setText('A%d' % (startRow), '序号')
    setTextRange('B%d:E%d' % (startRow,startRow), '维修内容')
    setText('F%d' % (startRow), '维修费')
    setTextRange('G%d:H%d' % (startRow,startRow), '备注')

    repairItems = json.loads(orderInfo['repair_items'])
    startRow+=1
    index = 0
    for item in repairItems:
        #print(item)
        index+=1
        setText('A%d' % startRow, index)
        setTextRange('B%d:E%d' % (startRow,startRow), item['name'])
        setText('F%d' % startRow, item['price'])
        setTextRange('G%d:H%d' % (startRow,startRow), '免费' if('discount' in item and item['discount']==0) else '')
    
    currentRow += (2 + index)




def buildParts():
    global currentRow
    global orderInfo
    startRow = currentRow
    setTextRange('A%d:H%d' %(startRow, startRow), '材料费用', isBold=True, isCenter=True)
    setRowHeight(startRow, 30)

    startRow+=1
    setText('A%d' % (startRow), '序号')
    setText('B%d' % (startRow), '材料名称')
    setText('C%d' % (startRow), '数量')
    setText('D%d' % (startRow), '单位')
    setText('E%d' % (startRow), '单价')
    setText('F%d' % (startRow), '金额')
    setTextRange('G%d:H%d' % (startRow,startRow), '备注')

    parts = json.loads(orderInfo['parts'])
    startRow+=1
    index = 0
    for part in parts:
        #print(part)
        index+=1
        setText('A%d' % startRow, index)
        setText('B%d' % (startRow), part['name'])
        setText('C%d' % (startRow), part['count'])
        setText('D%d' % (startRow), part['unit'])
        setText('E%d' % (startRow), part['price'])
        setText('F%d' % (startRow), part['price'] * part['count'] * part['discount'])
        setTextRange('G%d:H%d' % (startRow,startRow), '免费' if(part['discount']==0) else '')
    
    currentRow += (2 + index)


def buildFooter():
    setText('G%d' % currentRow, '客户：')



buildExcel(1)
