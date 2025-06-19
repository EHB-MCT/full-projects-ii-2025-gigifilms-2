import PocketBase from 'https://esm.sh/pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');

const container = document.getElementById('kaart-container');

async function fetchPosts() {
    try {
        const records = await pb.collection('posts').getFullList();

        records.forEach(record => {
            const imageUrl = pb.files.getURL(record, record.imageUrl);
            console.log(imageUrl)

            const kaart = document.createElement('div');
            kaart.classList.add('kaart');

            kaart.innerHTML = `
                <div class="kaart-header">
                    <img class="kaart-foto" src="${imageUrl}" alt="${record.project}">
                    <div class="kaart-info">
                        <p><strong>Project:</strong> ${record.project}</p>
                        <p><strong>Locatie:</strong> ${record.locatie}</p>
                        <p><strong>Opnamedatum:</strong> ${record.opnamedatum}</p>
                    </div>
                </div>
                <ul class="kaart-lijst">
                    <li>Belichting: ${record.belichting}</li>
                    <li>Weersomstandigheden: ${record.weer}</li>
                    <li>Camera: ${record.camera}</li>
                    <li>Lens: ${record.lens}</li>
                </ul>
            `;

            container.appendChild(kaart);
        });
    } catch (error) {
        console.error('Fout bij het ophalen van posts:', error);
    }
}

fetchPosts();

const form = document.getElementById('kaart-form');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const project = document.getElementById('project').value;
    const locatie = document.getElementById('locatie').value;
    const opnamedatum = document.getElementById('opnamedatum').value;
    const belichting = document.getElementById('belichting').value;
    const weer = document.getElementById('weer').value;
    const camera = document.getElementById('camera').value;
    const lens = document.getElementById('lens').value;
    const imageInput = document.getElementById('image').value;


    const formData = new FormData();
    formData.append('project', project);
    formData.append('locatie', locatie);
    formData.append('opnamedatum', opnamedatum);
    formData.append('belichting', belichting);
    formData.append('weer', weer);
    formData.append('camera', camera);
    formData.append('lens', lens);
    formData.append('image', imageInput);

    try {
        const record = await pb.collection('posts').create(formData);

record.imageUrl = record.image;  


        const kaart = document.createElement('div');
        kaart.classList.add('kaart');       

        kaart.innerHTML = `
            <div class="kaart-header">
                <img class="kaart-foto" src="${record.imageUrl}" alt="${record.project}">
                <div class="kaart-info">
                    <p><strong>Project:</strong> ${record.project}</p>
                    <p><strong>Locatie:</strong> ${record.locatie}</p>
                    <p><strong>Opnamedatum:</strong> ${record.opnamedatum}</p>
                </div>
            </div>
            <ul class="kaart-lijst">
                <li>Belichting: ${record.belichting}</li>
                <li>Weersomstandigheden: ${record.weer}</li>
                <li>Camera: ${record.camera}</li>
                <li>Lens: ${record.lens}</li>
            </ul>
        `;

        container.appendChild(kaart);
        form.reset();
    } catch (error) {
        console.error('Fout bij het toevoegen van kaart:', error);
        alert("Er ging iets mis bij het toevoegen van de kaart.");
    }
});
