const user = {
  name: prompt("Adınız nedir?"),
  age: prompt("Yaşınız kaç?"),
  profession: prompt("Mesleğiniz nedir?")
};

console.log("Kullanıcı Bilgileri:", user);

let cart = [];

let addMore = true;

while (addMore) {
  const productName = prompt("Ürün adı girin:");
  const productPrice = parseFloat(prompt("Ürün fiyatını girin:"));

  if (productName && !isNaN(productPrice)) {
    cart.push({ name: productName, price: productPrice });
  } else {
    alert("Geçerli bir ürün adı ve fiyat giriniz.");
  }

  addMore = confirm("Başka ürün eklemek ister misiniz?");
}

console.log("Sepet:");
cart.forEach((item, index) => {
  console.log(`${index + 1}. ${item.name} - ${item.price} TL`);
});

const total = cart.reduce((acc, item) => acc + item.price, 0);
console.log(`Toplam Fiyat: ${total.toFixed(2)} TL`);

function removeItemFromCart(nameToRemove) {
  const index = cart.findIndex(item => item.name.toLowerCase() === nameToRemove.toLowerCase());
  if (index !== -1) {
    const removed = cart.splice(index, 1)[0];
    console.log(`"${removed.name}" sepetten çıkarıldı.`);
  } else {
    console.log(`Ürün bulunamadı: ${nameToRemove}`);
  }
}

const removeProduct = confirm("Sepetten bir ürün çıkarmak ister misiniz?");
if (removeProduct) {
  const productToRemove = prompt("Hangi ürünü çıkarmak istersiniz? (ürün adı)");
  removeItemFromCart(productToRemove);

  console.log("Güncel Sepet:");
  cart.forEach((item, index) => {
    console.log(`${index + 1}. ${item.name} - ${item.price} TL`);
  });

  const updatedTotal = cart.reduce((acc, item) => acc + item.price, 0);
  console.log(`Güncel Toplam Fiyat: ${updatedTotal.toFixed(2)} TL`);
}
