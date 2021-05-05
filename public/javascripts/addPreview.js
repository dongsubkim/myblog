function displayPreview(input) {
    const template = `<div class="card g-0" style="width: 200px;" id="preview-card">
            <img src="imagesrc" class="card-img-top" style="height: 200px;" alt="...">
            <div class="card-body">
                <p class="card-text">Image Title</p>
            </div>
        </div>\n`

    const preview = document.querySelector("#image-preview")
    preview.classList.remove("d-none")

    if (input.files && input.files[0]) {
        for (const img of input.files) {
            var reader = new FileReader();
            reader.onload = function (e) {
                card = template.replace("imagesrc", e.target.result)
                console.log(e.target)
                card = card.replace("Image Title", img.name)
                preview.insertAdjacentHTML('beforeend', card)
            };
            reader.readAsDataURL(img);
        }
    }
}