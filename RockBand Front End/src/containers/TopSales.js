import React, { Component } from 'react'
import {withRouter} from 'react-router-dom';
import axios from 'axios';
import {base_url, img_url} from "../config";

import { Table, Button, Modal, Input, Form} from 'antd';


class TopSales extends Component {
    constructor(props){
        super(props);


        this.state = {
            loading: false,
            products: [],
            product_id: null,
            visible: false,
            editvisible: false,
            editproduct_id: false,
            editid: null
        }
    }

    componentDidMount(){
        this.getData()
    }

    showModal = () => {
        this.setState({
            visible: true,
            product_id: null
        });
    };

    getData = e => {
        axios.get(`${base_url}/topsales/get.php`).then(res=> {
            this.setState({products: res.data });
        })
    }

    handleDelete = id => {
        axios.get(`${base_url}/topsales/delete.php?id=${id}`).then(res=>{
            this.getData();
        }).catch(err=>{
            alert(err);
        })
    }

    handleOk = e => {
        axios.post(`${base_url}/topsales/save.php`, {
            product_id: this.state.product_id
        }).then(res=>{
            this.setState({
                visible: false,
            });
            this.getData();
        }).catch(err=>{
            alert(err);
        })
    };

    handleCancel = e => {
        this.setState({
            visible: false,
        });
    };


    onChange = e => {
        this.setState({
            [e.target.name]: e.target.value
        });
    }



    render (){

        const data = this.state.products.map((item, i)=>{
            return {
                ...item,
                key: i
            }
        });

        const {visible, loading} = this.state;




        const columns = [
            {
                title: 'ID',
                key: 'product_id',
                dataIndex: 'product_id',
            },
            {
                title: 'Картинка',
                key: 'imgsrc',
                render: (text, record) => (
                    <span>
                      <img width="50px" src={img_url+'/'+record.imgsrc} alt={record.name}/>
                    </span>
                ),
            },
            {
                title: 'Название',
                dataIndex: 'name',
                key: 'name'
            },
            {
                title: 'Описание',
                dataIndex: 'description',

                key: 'description'

            },
            {
                title: 'Цена',
                dataIndex: 'price',

                key: 'price'

            },
            {
                title: 'Страна',
                dataIndex: 'country',

                key: 'country'

            },
            {
                title: 'Категория',
                dataIndex: 'category',

                key: 'category'


            },
            {
                title: 'Действия',
                key: 'action',
                render: (text, record) => (
                    <span>


              <a href="javascript:;" onClick={()=>this.handleDelete(record.id)}>Удалить</a>
            </span>
                ),
            },
        ];


        return(
            <div>
                <Button type="primary" onClick={this.showModal} className={'mb-20'}>Добавить продукт</Button>
                <Modal
                    visible={visible}
                    title="Создать продукт"
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    footer={[
                        <Button key="back" onClick={this.handleCancel}>
                            Отменить
                        </Button>,
                        <Button key="submit" type="primary" loading={loading} onClick={this.handleOk}>
                            Сохранить
                        </Button>,
                    ]}
                >

                    <Form layout={'vertical'}>
                        <Form.Item label="ID продукта">
                            <Input placeholder="Введите ID продукта" onChange={this.onChange} name="product_id" value={this.state.product_id}/>
                        </Form.Item>
                    </Form>
                </Modal>


                <Table columns={columns} dataSource={data} />


            </div>
        )

    }
}
TopSales.propTypes = {
}
export default withRouter(TopSales);