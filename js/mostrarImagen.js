document.getElementById("perfil").onchange = function(){
    const ul = document.getElementById("mostrarImagen");
    const imagen = document.createElement("img");
    const read = new FileReader();
    const file = this.files;
    
    read.onload = function(){
      const result = this.result;
      const url = result;
      imagen.width = 150;
      imagen.src = url;
      ul.appendChild(imagen);
    }
    
    read.readAsDataURL(file[0]);
  }


  document.getElementById("fotos_del_producto").onchange = function(){
    const ul = document.getElementById("mostrarImagens");
    const imagen = document.createElement("img");
    const read = new FileReader();
    const file = this.files;
    
    read.onload = function(){
      const result = this.result;
      const url = result;
      imagen.width = 150;
      imagen.src = url;
      ul.appendChild(imagen);
    }
    
    read.readAsDataURL(file[0]);
  }



  document.getElementById("foto_producto").onchange = function(){
    const ul = document.getElementById("mostrarImagenss");
    const imagen = document.createElement("img");
    const read = new FileReader();
    const file = this.files;
    
    read.onload = function(){
      const result = this.result;
      const url = result;
      imagen.width = 150;
      imagen.src = url;
      ul.appendChild(imagen);
    }
    
    read.readAsDataURL(file[0]);
  }