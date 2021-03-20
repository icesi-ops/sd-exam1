FROM centos7
RUN yum search centos-release-gluster
RUN yum install centos-release-gluster37 
RUN yum install glusterfs gluster-cli glusterfs-libs glusterfs-server
RUN yum install glusterfs-server samba -y

EXPOSE 24007
EXPOSE 24008
EXPOSE 24009