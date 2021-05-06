class UserController {

    constructor(viewElements) {
        this.$form = document.getElementById(viewElements.formId);
        this.$table = document.getElementById(viewElements.tableId);
        this.formFields = Array.from(this.$form.elements); // ou this.formFields = [...this.$form.elements];
        this.onSubmit();
    }

    onSubmit() {
        /* 
        Nesse exemplo é mostrado o uso do this dentro de outro escopo:

        let _this = this; Armazena o this do escopo da classe UserController
        
        this.$form.addEventListener("submit", function(e) => {
            e.preventDefault();
        
            _this.getValues(); 
        });

        Isso é necessário pois foi colocada a palavra function na função do addEventListener
        function cria um novo escopo, então é preciso guardar o this do escopo da classe
        para usá-lo dentro do addEventListener. 
        Com uso de arrow functions isso não é necessário.            
        */

        this.$form.addEventListener("submit", e => {
            e.preventDefault();

            let props = this.getUserProps();
            this.getPhoto()
            .then(content => {
                props.photo = content;
                this.addLine(props);
            }, error => {
                console.error(error);
            })
        });
    }

    getPhoto() {
        return new Promise((resolve, reject) => {

            let fileReader = new FileReader();
            let elements = this.formFields.filter(element => { //Cria um novo array só com o elemento input file
                if (element.name === "photo") {
                    return element
                }
            })

            let file = elements[0].files[0];
            fileReader.onload = () => {
                resolve(fileReader.result);
            }
            fileReader.onerror = e => {
                reject(e);
            }
            fileReader.readAsDataURL(file);
        });
    }

    getUserProps() {
        let userProps = {};

        this.formFields.forEach((field) => {
            if (field.name == "gender") {
                if (field.checked) {
                    userProps[field.name] = field.value;
                }
            } else {
                userProps[field.name] = field.value; //Atribui nova propriedade ao objeto user
            }
        });

        return new User(userProps);
    }

    addLine(dataUser) {
        this.$table.insertAdjacentHTML("beforeend", ` 
        <tr>   
            <td><img src="${dataUser.photo}" alt="User Image" class="img-circle img-sm"></td>
            <td>${dataUser.name}</td>
            <td>${dataUser.email}</td>
            <td>${dataUser.admin}</td>
            <td>${dataUser.birth}</td>
            <td>
                <button type="button" class="btn btn-primary btn-xs btn-flat">Editar</button>
                <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
            </td>  
        </tr>     
            `);
    }    
}