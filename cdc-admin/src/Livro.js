import React, { Component } from 'react';
import $ from 'jquery';
import PubSub from 'pubsub-js';
import InputCustomizado from './componentes/InputCustomizado';
import SubmitCustomizado from './componentes/SubmitCustomizado';
import TratadorErros from './TratadorErros';

class FormularioLivro extends Component
{
    constructor()
    {
        super();
        this.state = {
            titulo: '',
            preco: '',
            autorId: ''
        }

        /*Binds de funções*/
        this.enviarForm = this.enviarForm.bind(this);
        this.setTitulo= this.setTitulo.bind(this);
        this.setPreco = this.setPreco.bind(this);
        this.setAutorId = this.setAutorId.bind(this);

    }
    setTitulo(evento)
    {
        this.setState({titulo:evento.target.value});
    }
    setPreco(evento)
    {
        this.setState({preco:evento.target.value});
    }
    setAutorId(evento)
    {
        this.setState({autorId:evento.target.value});
    }

    enviarForm(evento)
    {
        evento.preventDefault();
        $.ajax({
            url:"http://localhost:8080/api/livros",
            contentType: 'application/json',
            dataType: 'json',
            type: 'post',
            data: JSON.stringify({titulo:this.state.titulo, preco: this.state.preco, autorId:this.state.autorId}),
            success: function (resposta) {
                // this.props.callbackNovaListagem(resposta);
                PubSub.publish('atualiza-lista-livros',resposta);
                this.setState({titulo:'',preco:'', autorId:''});
                console.log("livro enviado com sucesso");
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
    render (){
        return (
            <div className="pure-form pure-form-aligned">
                <form className="pure-form pure-form-aligned" onSubmit={this.enviarForm} method="post">

                    <InputCustomizado id="titulo" type="text" name="titulo"
                                      label ="Titulo"
                                      value={this.state.titulo} onChange={this.setTitulo}/>

                    <InputCustomizado id="preco" type="text" name="preco"
                                      label ="Preco"
                                      value={this.state.preco} onChange={this.setPreco}/>
                    <div className="pure-control-group">
                        <label htmlFor="autorId">Autor</label>
                        <select name="autorId" id="autorId"  value={this.state.autorId} onChange={this.setAutorId}>
                            <option value="">Selecione autor</option>
                            {
                                this.props.autores.map(function (autor) {
                                    return <option key={autor.id} value={autor.id}>{autor.nome}</option>;
                                })
                            }
                        </select>
                    </div>

                    <SubmitCustomizado  label="Gravar" />
                </form>
            </div>

        );
    }

}
class TabelaLivro extends Component
{
    render (){
        return (
            <div>
                <table className="pure-table">
                    <thead>
                    <tr>
                        <th>Titulo</th>
                        <th>Preco</th>
                        <th>Autor</th>
                    </tr>
                    </thead>
                    <tbody>

                    {
                        this.props.lista.map(function (livro) {
                            return(
                                <tr key={livro.id}>
                                    <td >
                                        {livro.titulo}
                                    </td>
                                    <td>
                                        {livro.preco}
                                    </td>
                                    <td>
                                        {livro.autor.nome}
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
export default class LivroBox extends Component{

    constructor()
    {
        super();
        this.state = {
            lista:[],
            autores: []
        }
    }

    componentDidMount()
    {
        $.ajax({
            url:"http://localhost:8080/api/livros",
            dataType: 'json',
            success: function(resposta){
                this.setState({lista:resposta});
            }.bind(this)
        });
        $.ajax({
            url:"http://localhost:8080/api/autores",
            dataType: 'json',
            success: function(resposta){
                this.setState({autores:resposta});
            }.bind(this)
        });
        PubSub.subscribe('atualiza-lista-livros',function (topico,novaLista) {
            this.setState({lista:novaLista});
        }.bind(this));
    }
    render ()
    {
        return (
            <div>
                {/*
                 Forma usada para atualizar a lista de autores sem um pubsub
                 <FormularioAutor callbackNovaListagem={this.atualizaListagem}/>*/}

                <div className="header">
                    <h1>Cadastro de Livro </h1>
                </div>

                <div className="content" id="content">
                    <FormularioLivro autores={this.state.autores} />
                    <TabelaLivro lista={this.state.lista}/>
                </div>
            </div>

        );
    }
}