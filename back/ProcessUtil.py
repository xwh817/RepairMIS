import os
import psutil

def isRunningInLinux(process_name):
    try:
        process = len(os.popen('ps aux | grep "' + process_name + '" | grep -v grep').readlines())
        print('%s is exists: %d' % (process_name, process))
        if process >= 1:
            return True
        else:
            return False
    except:
        print("Check process ERROR!!!")
        return False


def countRunningInWin(process_name):
    # 需要安装三方模块psutil
    pl = psutil.pids()
    count = 0
    for pid in pl:
        if psutil.Process(pid).name() == process_name:
            print('pid of %s is: %d' % (process_name, pid))
            count += 1
    print('count of %s is:%d' % (process_name, count))
    return count
""" 
def log(logString):
    with open("log.txt","a+") as f:
        f.write(logString)
        f.write('\n')
 """

""" if __name__ == '__main__':
    p = 'run.exe'
    count = countRunningInWin(p)
    print("正在运行的%s进程数：%d" % (p, count)) """
