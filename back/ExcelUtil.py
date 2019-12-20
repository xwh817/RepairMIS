import openpyxl
from openpyxl.styles import Font, Border, Side
from openpyxl.styles import Alignment

mywb = openpyxl.Workbook()
mysheet = mywb.active   # 当前活动的sheet
titleFont = Font(size=12, bold=True)
textFont = Font(size=12)
alignCenter = Alignment(horizontal='center',vertical='center',wrap_text=True)
thin_border = Border(left=Side(style='thin'), right=Side(style='thin'), top=Side(style='thin'), bottom=Side(style='thin'))
currentRow = 1

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

def setText(cell, text, isTitle=False):
    mysheet[cell] = text
    #mysheet[cell].border = thin_border
    if isTitle:
        mysheet[cell].font = titleFont
        mysheet[cell].alignment = alignCenter
    else:
        mysheet[cell].font  = textFont

def setTextRange(cell_range, text, isTitle=False):
    mysheet.merge_cells(cell_range)
    setText(cell_range.split(':')[0], text, isTitle=isTitle)

def buildExcel():
    init()
    buildTitle()
    buildClientInfo()
    mysheet.column_dimensions['E'].font = textFont
    #setBorder(mysheet, "A1:H10")
    setBorder()
    buildFooter()
    mywb.save('test.xlsx')

def buildTitle():
    global currentRow
    setTextRange('A1:H1', '荆州市砼盟工程设备有限公司维修清单', isTitle=True)
    currentRow += 1

def buildClientInfo():
    global currentRow
    startRow = currentRow
    mysheet.merge_cells('A%d:D%d' % (startRow, startRow+1))
    setText('E%d' % startRow, '日期')
    setText('E%d' % (startRow+1), '维修订单号')
    setTextRange('F%d:H%d' %(startRow, startRow), '')
    setTextRange('F%d:H%d' %(startRow+1, startRow+1), '')

    setTextRange('A%d:H%d' %(startRow+2, startRow+2), '客户信息', isTitle=True)
    mysheet.row_dimensions[startRow+2].height = 30

    setText('A%d' % (startRow+3), '客户名称')
    setTextRange('B%d:H%d' %(startRow+3, startRow+3), '')

    setText('A%d' % (startRow+4), '客户联系人')
    setTextRange('B%d:D%d' %(startRow+4, startRow+4), '')

    setText('E%d' % (startRow+4), '电话')
    setTextRange('F%d:H%d' %(startRow+4, startRow+4), '')

    setText('A%d' % (startRow+5), '型号')
    setTextRange('B%d:D%d' %(startRow+5, startRow+5), '')

    setText('E%d' % (startRow+5), '出厂编号')
    setTextRange('F%d:H%d' %(startRow+5, startRow+5), '')

    currentRow += 6


def buildStoreInfo():
    global currentRow
    startRow = currentRow
    setTextRange('A%d:H%d' %(startRow, startRow), '服务信息', isTitle=True)
    setText('A%d' % startRow+1, '地址')
    setTextRange('B%d:H%d' %(startRow+1, startRow+1), '')

    currentRow += 3

def buildFooter():
    setText('H%d' % currentRow, '客户：')

buildExcel()
