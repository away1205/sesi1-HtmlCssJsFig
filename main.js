const RENDER_EVENT = 'render-buku'
const dataBuku = [];
const SAVED_EVENT = 'saved-buku'
const STORAGE_KEY = 'BUKU_APPS'
const searchInput = document.querySelector('#form-cari')


// ----------------------- Event Listener ------------------------
document.addEventListener('DOMContentLoaded', function() {
  const bukuMasuk = document.querySelector('#buku-masuk');
  bukuMasuk.addEventListener('submit', function(event){
    event.preventDefault();
    newBuku();

    bukuMasuk.reset();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

document.addEventListener(RENDER_EVENT, function () {
  const belumDibacaJudul = document.querySelector('#belum-selesai-judul');
  belumDibacaJudul.innerHTML = '';

  const sudahDibacaJudul = document.querySelector('#sudah-selesai-judul')
  sudahDibacaJudul.innerHTML = '';

  for (const itemBuku of dataBuku){
    const elementBuku = showBuku(itemBuku);
    if(!itemBuku.isCompleted){
      belumDibacaJudul.append(elementBuku)
    } else {
      sudahDibacaJudul.append(elementBuku)
    }
  }

  const showShow = document.getElementsByClassName('ri-arrow-down-circle-line');

  for (let i = 0; i < showShow.length; i++){
    showShow[i].addEventListener('click', function(){
      const showParent = showShow[i].parentElement;
      const nextShowParent = showParent.nextElementSibling
      nextShowParent.classList.toggle('drop__container-hidden')
    })
  }
});

searchInput.addEventListener('submit', function(e){
  e.preventDefault();
  const target = document.querySelector('#cari-buku').value.toLowerCase();
  const cariJudul = document.getElementsByClassName('judul__fw');

  for (let i = 0; i < cariJudul.length; i++){
    const lowCase = cariJudul[i].innerText.toLowerCase();
    const parent = cariJudul[i].parentElement.parentElement;
    if (lowCase == target){
      cariJudul[i].style.color = 'white';
      cariJudul[i].parentElement.style.backgroundColor = 'black';
    }
    setTimeout(() =>{
      cariJudul[i].style.color = 'black';
      cariJudul[i].parentElement.style.backgroundColor = 'white';
    }, 3500)
  }

  searchInput.querySelector('#cari-buku').value = '';
});

document.addEventListener(SAVED_EVENT, function () {
  console.log(localStorage.getItem(STORAGE_KEY));
});

// --------------------------- Function ------------------------
function newBuku(){
  // Judul
  const judulBuku = document.querySelector('#judul-buku').value;
  const penulisBuku = document.querySelector('#penulis-buku').value;
  const tahunBuku = document.querySelector('#tahun-buku').value;

  const idBuku = buatId();
  const objBuku = objectBuku(idBuku, judulBuku, penulisBuku, tahunBuku, false);
  dataBuku.push(objBuku);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
};

function buatId(){
  return +new Date();
}

function objectBuku(idBuku, judulBuku, penulisBuku, tahunBuku, isCompleted){
  return{
    idBuku,
    judulBuku,
    penulisBuku,
    tahunBuku,
    isCompleted
  }
}

function showBuku(objectBuku){

  const newDiv = document.createElement('div');
  newDiv.classList.add('dropdown');

  const newJudul = document.createElement('p');
  newJudul.classList.add('Selesai__info', 'judul__fw');
  newJudul.innerText = objectBuku.judulBuku;
  newDiv.append(newJudul);

  const newI = document.createElement('i');
  newI.classList.add('ri-arrow-down-circle-line');
  newDiv.append(newI);

  // Penulis & Tahun
  const newDropContainer = document.createElement('div');
  newDropContainer.classList.add('drop__container')
  newDiv.after(newDropContainer);

  const newDropInfo = document.createElement('div');
  newDropInfo.classList.add('dropdown__info')
  newDropContainer.append(newDropInfo);

  const infoContainer = document.createElement('div')
  infoContainer.classList.add('info__container')
  newDropInfo.append(infoContainer);

  const newPenulis = document.createElement('p');
  newPenulis.innerText = objectBuku.penulisBuku;
  newPenulis.classList.add('selesai__info');
  infoContainer.append(newPenulis);

  const newTahun = document.createElement('p');
  newTahun.innerText = objectBuku.tahunBuku;
  newTahun.classList.add('selesai__info');
  infoContainer.append(newTahun);

  const dropdownButton = document.createElement('div');
  dropdownButton.classList.add('dropdown__button')
  newDropInfo.append(dropdownButton);

  if (objectBuku.isCompleted){
    const undoButton = document.createElement('i');
    undoButton.classList.add('ri-refresh-line', 'edit');
  

    undoButton.addEventListener('click', function(){
      undoBukuFromCompleted(objectBuku.idBuku);
    });

    const deleteButton = document.createElement('i');
    deleteButton.classList.add('ri-close-line', 'delete');

    deleteButton.addEventListener('click', function(){
      removeBookFromCompleted(objectBuku);
    });

    dropdownButton.append(undoButton, deleteButton);
  } else {
    const checkButton = document.createElement('i');
    checkButton.classList.add('ri-check-line', 'check')

    checkButton.addEventListener('click', function(){
      addBukuToCompleted(objectBuku.idBuku);
    });

    const deleteButton = document.createElement('i');
    deleteButton.classList.add('ri-close-line', 'delete');

    deleteButton.addEventListener('click', function(){
      removeBookFromCompleted(objectBuku);
    });


    dropdownButton.append(checkButton, deleteButton);
  }

  const greatContainer = document.createElement('div');
  greatContainer.classList.add('great__container');
  greatContainer.append(newDiv);
  greatContainer.append(newDropContainer);
  greatContainer.setAttribute('id', `buku-${objectBuku.idBuku}`);

  return greatContainer;
}

function showInfo(objectBukuId){
  const infoTarget = findBuku(objectBukuId)
  console.log(infoTarget)
}

function addBukuToCompleted(objectBukuId){
  const bukuTarget = findBuku(objectBukuId);

  if (bukuTarget == null) return;

  bukuTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function findBuku(objectBukuId){
  for (const bukuItem of dataBuku){
    if (bukuItem.idBuku === objectBukuId){
      return bukuItem
    }
  }
  return null;
}

function undoBukuFromCompleted(objectBukuId){
  const bookTarget = findBuku(objectBukuId);

  if (bookTarget == null) return;

  bookTarget.isCompleted = false
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function removeBookFromCompleted(objectBukuId){
  const bookTarget = findBukuIndex(objectBukuId);
  let isDelete = prompt('Serius, mau dihapus? (y/n)')
  
  if (isDelete.toLowerCase() == 'y' || isDelete.toLowerCase() == 'yes'){
    dataBuku.splice(bookTarget, 1)
  }
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function findBukuIndex(objectBukuId){
  for (const index in dataBuku){
    if (dataBuku[index].idBuku === objectBukuId){
      return index;
    }
  }
  return -1
}

function saveData(){
  if (isStorageExist()){
    const parsed = JSON.stringify(dataBuku);
    localStorage.setItem(STORAGE_KEY, parsed)
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

function isStorageExist(){
  if (typeof (storage) === undefined){
    alert('Browser Tidak Mendukung Local Storage')
    return false;
  }
  return true;
}

function loadDataFromStorage(){
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null){
    for (const book of data){
      dataBuku.push(book)
    }
  }
  document.dispatchEvent(new Event(RENDER_EVENT));
}