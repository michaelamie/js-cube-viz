function Cube(cubeId, json, rotationDelay) {
    
    this.element = document.getElementById(cubeId);
    this.posts = json.data;
    this.rotationDelay = rotationDelay;
    this.replaceNextRotation = 0;
    
    var cube = this;
        
    window.addEventListener('load', function() {
        cube.updateCubeSize();
    });
        
    window.addEventListener('resize', function() {
        cube.updateCubeSize();  
    });
    
    var rotationHandler = function(e) {
        cube.rotationHandler(e.animationName);
        setTimeout(function() {
            cube.rotate();
        }, cube.rotationDelay);
    };
    
    this.element.addEventListener('animationend', rotationHandler);
    this.element.addEventListener('webkitAnimationEnd', rotationHandler);
    
    window.setTimeout(function() {
        cube.loadFace('frontFace', 0);
        cube.loadFace('rightFace', 1);
        cube.loadFace('backFace', 2);
        cube.loadFace('leftFace', 3);
    }, 1000);
}

Cube.prototype.rotationHandler = function(animationName) {
    var replacement = (this.replaceNextRotation + 4) % this.posts.length;
    var update = false;
    switch (animationName) {
        case 'cubeRotationFrontToRight':
            this.loadFace('frontFace', replacement);
            update = true;
            break;
        case 'cubeRotationRightToBack':
            this.loadFace('rightFace', replacement);
            update = true;
            break;
        case 'cubeRotationBackToLeft':
            this.loadFace('backFace', replacement);
            update = true;
            break;
        case 'cubeRotationLeftToFront':
            this.loadFace('leftFace', replacement);
            update = true;
            break;
    }
    if (update) {
        this.replaceNextRotation = ((this.replaceNextRotation + 1) % this.posts.length);
    }
}

Cube.prototype.updateCubeSize = function() {
    
    var size = document.documentElement.clientHeight * .60;
    var translateX = - size / 2;
    var translateZ = size / 2;
    var faces = this.element.getElementsByClassName('face');
    
    // Scale each face according to our new viewport size
    for (var face = 0; face < faces.length; ++face) {
        faces[face].style.height = size + "px";
        faces[face].style.width = size + "px";
    }
    
    // CSS3 transformations / rotations for each face
    faces[0].style.transform =
        "translateX(" + translateX + "px) translateZ(" + translateZ + "px)";
    faces[2].style.transform =
        "translateX(" + translateX + "px) rotateY(180deg) translateZ(" + translateZ + "px)";
    faces[3].style.transform =
        "translateX(" + translateX + "px) rotateY(-90deg) translateZ(" + translateZ + "px)";
    
    // WebKit transformations / rotations for each face
    faces[0].style.webkitTransform =
        "translateX(" + translateX + "px) translateZ(" + translateZ + "px)";
    faces[2].style.webkitTransform =
        "translateX(" + translateX + "px) rotateY(180deg) translateZ(" + translateZ + "px)";
    faces[3].style.webkitTransform =
        "translateX(" + translateX + "px) rotateY(-90deg) translateZ(" + translateZ + "px)";
};

Cube.prototype.loadFace = function(faceClass, postIndex) {
    
    face = this.element.getElementsByClassName(faceClass)[0];
    var post = this.posts[postIndex];
    
    // Set background
    var imageURL = "url(" + post.images.standard_resolution.url + ")";
    face.style.background = imageURL + " , linear-gradient(-45deg, #222 0%, #333 100%)";
    face.style.backgroundSize = "cover";
    
    // Set data
    face.getElementsByClassName('username')[0].textContent = post.user.username;
    face.getElementsByClassName('text')[0].textContent = post.caption.text;
};

Cube.prototype.rotate = function() {
    switch ( this.element.classList[1] ) {
        case undefined:
            var element = this.element;
            window.setTimeout(function() {
                element.classList.add('cubeRotationFrontToRight');
            }, this.rotationDelay);
            break;
        case 'cubeRotationFrontToRight':
            this.element.classList.remove('cubeRotationFrontToRight');
            this.element.classList.add('cubeRotationRightToBack');
            break;
        case 'cubeRotationRightToBack':
            this.element.classList.remove('cubeRotationRightToBack');
            this.element.classList.add('cubeRotationBackToLeft');
            break;
        case 'cubeRotationBackToLeft':
            this.element.classList.remove('cubeRotationBackToLeft');
            this.element.classList.add('cubeRotationLeftToFront');
            break;
        case 'cubeRotationLeftToFront':
            this.element.classList.remove('cubeRotationLeftToFront');
            this.element.classList.add('cubeRotationFrontToRight');
            break;
    }
};

var loadPosts = (function(json) {
    
    const CLIENT_ID = "Your client_id here";
    const HASHTAG = "kitteh";
    
    var script = document.createElement('script');
    script.src = "https://api.instagram.com/v1/tags/" + HASHTAG + "/media/recent?client_id=" + CLIENT_ID + "&callback=loadPosts";
    document.querySelector('body').appendChild(script);
    
    function loadPosts(json) {
        var cube = new Cube('cubeInstance', json, 5000);
    }
    
    return loadPosts;
})();