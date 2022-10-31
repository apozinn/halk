//socket send image
{
  function(img) {
    const reader = new FileReader();
    reader.onload = function() {
      const bytes = new Uint8Array(img);
      socket.emit('image', bytes);
    };
    reader.readAsArrayBuffer(img);

    socket.on('image', async image => {
      const buffer = Buffer.from(image);
      await fs.writeFile('/tmp/image', buffer).catch(console.error); // fs.promises
    });
    //Para receber do servidor:

    // Server side
    socket.emit('image', image.toString('base64')); // image should be a buffer
    // Client side
    socket.on('image', image => {
      // create image with
      const img = new Image();
      // change image type to whatever you use, or detect it in the backend
      // and send it if you support multiple extensions
      img.src = `data:image/jpg;base64,${image}`;
      // Insert it into the DOM
    });
  }
}

{
  features: {
    userProfile [=]
    config. de notificação [-]
    status [=]
    chamadas [=]
    menu [=] 
    grupos [-]
    ligação de voz [-]
    ligação  de video [-]
    enviar midia [-] {
      image [-]
      video [-]
      audio [-]
      documento [-]
    }
    excluir mensagem
  }
  screens: {
    ponto no icone na tabBar [-]
    fixar conversa [-]
    marcar como lida [-]
    bloquear usuario [-]
    denunciar usuario [-]
    copiar id da conversa [-]
    open camara [=]
  }
  correções: {
    usuario nao aparece online [-]
  }
}

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
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
