#!/bin/bash
proc_name=node

proc_num()                                              # 计算进程数
{
        num=`ps -ef | grep $proc_name | grep -v grep | wc -l`
        return $num
}


proc_num
number=$?
if [ $number -eq 0 ]                                    # 判断进程是否存在
then
        cd ~/uumai/ui/uumai
        nohup node app.js &
        #echo 'run'
        #nohup /home/rock/kanxg/tools/apache-storm-0.9.3/bin/storm nimbus >/dev/null 2>&1 &
        #cd /home/rock/kanxg/tools/apache-storm-0.9.3/bin ; ./storm nimbus  -DZone    # 重启进程的命令，请相应修改
        #proc_id                                         # 获取新进程号
        #echo ${pid}, `date` >> $file_name                      # 将新进程号和重启时间记录
fi
