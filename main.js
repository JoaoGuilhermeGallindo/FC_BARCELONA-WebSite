//Adicionar itens ao carrinho
document.querySelectorAll('.adicionar-carrinho').forEach(button => {
    button.addEventListener('click', function () {
        const itemElement = button.parentElement;
        const itemName = itemElement.querySelector('h3').innerText;
        const itemPrice = itemElement.querySelector('h4').innerText;

        let cartItems = JSON.parse(localStorage.getItem('cart')) || [];
        cartItems.push({ name: itemName, price: itemPrice });
        localStorage.setItem('cart', JSON.stringify(cartItems));

        alert(`${itemName} foi adicionado ao carrinho!`);
        atualizarCarrinho();
    });
});

var total = "0,00"

window.onload = atualizarCarrinho;

//Atualizar o carrinho de compras
function atualizarCarrinho() {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const cartContainer = document.querySelector('.card-items');
    const totalElement = document.querySelector('.total');
    total = 0;

    cartContainer.innerHTML = '';

    cartItems.forEach(item => {
        const cardItem = document.createElement('div');
        cardItem.className = 'card-item';
        cardItem.innerHTML = `<p>${item.name}</p> <p>Preço: ${item.price}</p> <button onclick="removerDoCarrinho(this)">Remover</button>`;
        cartContainer.appendChild(cardItem);

        total += parseFloat(item.price.replace('R$', '').replace(',', '.'));
    });

    totalElement.innerText = `Total: R$ ${total.toFixed(2)}`;

}

//Remover item do carrinho
function removerDoCarrinho(button) {
    const itemElement = button.parentElement;
    const itemName = itemElement.querySelector('p').innerText;

    let cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    cartItems = cartItems.filter(item => item.name !== itemName);
    localStorage.setItem('cart', JSON.stringify(cartItems));

    itemElement.remove();

    atualizarCarrinho();
}

//Finalizar compra
const FinalizarCompra = document.querySelector(".finalizar-compra")
FinalizarCompra.addEventListener('click', makeFinalizarCompra)

function makeFinalizarCompra(){
   if (total === "0,00" || total === 0) {
    alert("Seu carrinho está vazio!")
   } 
   else {
    alert(
        `
        Obrigado pela sua compra!
        Valor do pedido: R$${total}
        `
    )
    gerarNotaFiscalPDF();
   }
   document.querySelector(".card").innerHTML = ""
   localStorage.removeItem('cart'); // Limpa o carrinho do localStorage
   atualizarCarrinho()
}

//Gerar nota fiscal em PDF
function gerarNotaFiscalPDF() {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Define informações do cabeçalho
    const lojaNome = "Barça Official Store";
    const data = new Date().toLocaleDateString();
    const hora = new Date().toLocaleTimeString();
    const cnpj = "CNPJ: 00.000.000/0000-00";

    // Configura estilo e título da nota
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text(lojaNome, 20, 20);
    doc.setFontSize(10);
    doc.text(`DATA: ${data} - ${hora}`, 20, 30);
    doc.text(cnpj, 20, 35);
    
    // Linha de divisória
    doc.setLineWidth(0.5);
    doc.line(20, 40, 190, 40);

    // Seção de "Compras"
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("COMPRAS", 20, 50);
    doc.setLineWidth(0.5);
    doc.line(20, 52, 190, 52);

    // Listagem de itens do carrinho
    let y = 60;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    cartItems.forEach((item, index) => {
        doc.text(`${index + 1} ${item.name}`, 20, y);
        doc.text(item.price, 180, y, { align: "right" });
        y += 8;
    });

    // Total
    doc.setLineWidth(0.5);
    doc.line(20, y + 5, 190, y + 5); // Linha acima do total
    doc.setFont("helvetica", "bold");
    doc.text("TOTAL", 20, y + 15);
    doc.text(`R$ ${total.toFixed(2)}`, 180, y + 15, { align: "right" });

    // Salva o PDF
    doc.save("nota_fiscal.pdf");
}
