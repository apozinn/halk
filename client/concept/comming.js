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
    status [-]
    chamadas [-]
    menu [-] {
      config. geral [-]
      config. conversa [-]
    }
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
    tres pontos [-]
    ponto no icone na tabBar [-]
    searchChat [-]
    excluir chat [-]
    fixar conversa [-]
    marcar como lida [-]
    bloquear usuario [-]
    denunciar usuario [-]
    copiar id da conversa [-]
    open camara [-]
  }
  correções: {
    usuario nao aparece online [-]
  }
}

[ geral: definir status, conta, perfil, privacidade/segurança ]
[ aplicativo: conversas, idioma, armazenamento, notificação, aparencia ]
[ suporte/etc:  suporte, creditos ]
[ updates: novidades ]
[ conta: sair, mudar de conta ]
[ dev: codigo fonte, licenças, debug logs, clientInfo, apiInfo ]