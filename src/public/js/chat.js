    document.getElementById('open-support').addEventListener('click', function() {
        // Abrir el modal para mostrar el chat
        const chatModal = new bootstrap.Modal(document.getElementById('chatModal'));
        chatModal.show();
    });

    document.getElementById('send-chat').addEventListener('click', function() {
        const input = document.getElementById('chat-input');
        const chatBox = document.getElementById('chat-box');

        // Agregar el mensaje del usuario al chat
        const userMessage = document.createElement('div');
        userMessage.textContent = 'Tú: ' + input.value;
        chatBox.appendChild(userMessage);

        // Enviar la pregunta a la IA a través de una API
        fetch('/products/soporte-ia', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: input.value })
        })
        .then(response => response.json())
        .then(data => {
            // Mostrar la respuesta de la IA en el chat
            const iaMessage = document.createElement('div');
            iaMessage.textContent = 'IA: ' + data.response;
            chatBox.appendChild(iaMessage);
            chatBox.scrollTop = chatBox.scrollHeight;  // Desplazarse hacia abajo para ver el mensaje
        })
        .catch(err => {
            console.error('Error al comunicarse con la IA:', err);
        });

        input.value = '';  // Limpiar el input
    });
