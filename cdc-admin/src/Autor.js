import React, { Component } from 'react';
import InputCustomizado from './componentes/InputCustomizado';
import SubmitCustomizado from './componentes/SubmitCustomizado';
import $ from 'jquery';
import PubSub from 'pubsub-js';
import TratadorErros from './TratadorErros';

 class FormularioAutor extends Component
{

    constructor()
    {
        super();
        this.state = {
            nome: '',
            email:'',
            senha: ''
        }

        /*Binds de funções*/
        this.enviarForm = this.enviarForm.bind(this);

    }
    enviarForm(evento)
    {
        evento.preventDefault();
        $.ajax({
            url:"http://localhost:8080/api/autores",
            contentType: 'application/json',
            dataType: 'json',
            type: 'post',
            data: JSON.stringify({nome:this.state.nome,email:this.state.email,senha:this.state.senha}),
            success: function (resposta) {
                 // this.props.callbackNovaListagem(resposta);
                 PubSub.publish('atualiza-lista-autores',resposta);
                this.setState({nome:'',email:'',senha:''});
                console.log("enviado com sucesso");
            }.bind(this),
            error: function (resposta) {
                if(resposta.status === 400)
                {
                   new TratadorErros().publicaErros(resposta.responseJSON);

                }
            },
            beforeSend()
            {
                PubSub.publish("limpa-erros",{});
            },
        });
    }

    salvarCampo(input, evento)
    {
        let campo = {};
        campo[input] = evento.target.value;
        this.setState(campo);
    }

    render (){
        return (
            <div className="pure-form pure-form-aligned">
            <form className="pure-form pure-form-aligned" onSubmit={this.enviarForm} method="post">

                <InputCustomizado id="nome" type="text" name="nome"
                                  label ="Nome"
                                  value={this.state.nome} onChange={this.salvarCampo.bind(this,'nome')}/>
                <InputCustomizado id="email" type="email" name="email"
                                  label ="Email"
                                  value={this.state.email} onChange={this.salvarCampo.bind(this,'email')}/>
                <InputCustomizado id="senha" type="password" name="senha"
                                  label ="Senha"
                                  value={this.state.senha} onChange={this.salvarCampo.bind(this,'senha')}/>
                <SubmitCustomizado  label="Gravar" />
            </form>
            </div>

        );
    }
}

class TabelaAutor extends Component
{


    render (){
        return (
            <div>
                <table className="pure-table">
                    <thead>
                    <tr>
                        <th>Nome</th>
                        <th>email</th>
                    </tr>
                    </thead>
                    <tbody>

                    {
                        this.props.lista.map(function (aluno) {
                            return(
                                <tr key={aluno.id}>
                                    <td >
                                        {aluno.nome}
                                    </td>
                                    <td>
                                        {aluno.email}
                                    </td>
                                </tr>
                            )
                        })
                    }

                    </tbody>
                </table>
            </div>
        );
    }
}


export default class AutorBox extends Component {

    constructor()
    {
        super();
        this.state = {
            lista: []
        }
        // this.atualizaListagem = this.atualizaListagem.bind(this);
    }

    componentWillMount()
    {
        $.ajax({
            url:"http://localhost:8080/api/autores",
            dataType: 'json',
            success: function(resposta){
                this.setState({lista:resposta});
            }.bind(this)
        });

        PubSub.subscribe('atualiza-lista-autores',function (topico,novaLista) {
            this.setState({lista:novaLista});
        }.bind(this));
    }

    /* Fução usada para atualizar a lista de autores , porém
    quando passamos usar a api pubsub esta função deixou de ser
    necessária, porém deixarei ela aqui como exemplo. */

    atualizaListagem(novaLista)
    {
        this.setState({lista:novaLista});
    }

     render()
     {
         return (
            <div>
                {/*
                Forma usada para atualizar a lista de autores sem um pubsub
                <FormularioAutor callbackNovaListagem={this.atualizaListagem}/>*/}

                <div className="header">
                    <h1>Cadastro de Autor </h1>
                </div>

                <div className="content" id="content">
                    <FormularioAutor />
                    <TabelaAutor lista={this.state.lista}/>
                </div>
            </div>
         );
     }
}