import React, { Component } from 'react';
import PubSub from 'pubsub-js';

export default class TratadorErros extends Component
{

    publicaErros(erro)
    {
        for(var i = 0; i<erro.errors.length ; i++)
        {
            PubSub.publish('erro-validacao',  erro.errors[i]);
        }
    }

}