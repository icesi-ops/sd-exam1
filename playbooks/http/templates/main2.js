var baseurl= "http://192.168.33.200";
        
            function loadFiles(){
                var xmlhttp= new XMLHttpRequest();
                xmlhttp.open("GET",baseurl + "/",true);
                xmlhttp.onreadystatechange = function() {
                    if(xmlhttp.readyState == 4 && xmlhttp.status == 200){
                        var files= JSON.parse(xmlhttp.responseText);
                        var tbltop = `<table>
			                          <tr><th>Id</th><th>Name</th><th>Path</th><th>Type</th></tr>`;
                        var main = "";
                        for(i = 0; i <files.length; i++){
                            main += "<tr><td>"+files[i].id+"</td><td>"+files[i].name+"</td></td>"+files[i].path+"</td><td>"+files[i].type+"</td></tr>";  
                        } 
                        var tblbottom = "</table>";
                        var tbl= tbltop + main + tblbottom;
                        document.getElementById("information").innerHTML = tbl;
                    }
                };
                xmlhttp.send(); 
            }

            function loadStorage(){
                var xmlhttp= new XMLHttpRequest();
                xmlhttp.open("GET",baseurl + "/avstorage",true);
                xmlhttp.onreadystatechange = function() {
                    if(xmlhttp.readyState == 4 && xmlhttp.status == 200){
                        var files= xmlhttp.responseText;
                        document.getElementById("storage").innerHTML = files;
                    }
                };
                xmlhttp.send(); 
            }

            function selectedFile(){
                var fileSelected=document.getElementById("myfile");
                var file= fileSelected.files[0];

            }

            function uploadFile(){
               // var fileSelected=document.getElementById("myfile");
                //var file= fileSelected.files[0];
                //var fd = new FormData();
                //fd.append(file.name,file.fi);
                //var xmlhttp= new XMLHttpRequest();
                //xmlhttp.open("POST",baseurl + "/uploads",true);
                //xmlhttp.send(fd);
            }

            window.onload = function(){
                loadFiles();
                loadStorage();
                selectedFile();
               uploadFile();
            }
