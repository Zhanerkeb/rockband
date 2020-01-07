import React, {Component} from 'react'
import {withRouter} from 'react-router-dom';
import {Table, Divider, Button, Modal, Input, Form, message, Icon, Upload, InputNumber} from 'antd';
import MaskedInput from 'antd-mask-input'
import axios from "axios";
import {base_url, img_url} from "../config";
import Highlighter from 'react-highlight-words';

function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
};

function beforeUpload(file) {
    console.log(file.type);
    const isJPEG = file.type === 'image/jpeg';
    const isPNG = file.type === 'image/png';

    if (!(isPNG || isJPEG)) {
        message.error('You can only upload JPG, JPEG or PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
        message.error('Image must smaller than 2MB!');
    }
    return (isPNG || isJPEG ) && isLt2M;
};

class Articles extends Component {


    constructor(props) {
        super(props);
        this.state = {
            articles: [],
            visible: false,
            imageUrl: null,
            loading: false,
            img: null,
            searchText: '',
            filteredInfo: null,
            sortedInfo: null,

            name: '',
            time: '',
            date: '',
            place: '',
            number_of_participants: '',
            rate: '',
            image: '',


            edit_name: '',
            edit_time: '',
            edit_date: '',
            edit_place: '',
            edit_number_of_participants: '',
            edit_rate: '',
            edit_image: '',

            editimg:'',
            editid: '',
            editvisible: false
        }
    }


    componentDidMount() {
        this.getData()
    }

    showModal = () => {
        this.setState({
            visible: true,

            imageUrl: null,
            name: '',
            time: '',
            date: '',
            place: '',
            number_of_participants: '',
            rate: '',
            image: '',

        });
    };

    getData = e => {
        let token = JSON.parse(localStorage.getItem('token'));
        axios.get(`${base_url}/festivals`, { headers: {"Authorization" : `Bearer ${token}`} }).then(res => {
            console.log(res.data);
            this.setState({articles: res.data});
        })
    };

    handleDelete = id => {
        let token = JSON.parse(localStorage.getItem('token'));

        axios.delete(`${base_url}/festivals/${id}`, { headers: {"Authorization" : `Bearer ${token}`} }).then(res => {
            this.getData();
        }).catch(err => {
            alert(err);
        })
    };

    handleOk = e => {
        let token = JSON.parse(localStorage.getItem('token'));

        if (this.state.name.length > 0) {
            console.log('time: ' + this.state.time);
            let fm = new FormData();

            fm.append('img', this.state.img);
            fm.append('name', this.state.name);
            fm.append('time', this.state.time?this.state.time:null);
            fm.append('date', this.state.date?this.state.date:null);
            fm.append('place', this.state.place);
            fm.append('number_of_participants', this.state.number_of_participants);
            fm.append('rate', this.state.rate);

            axios.post(`${base_url}/festivals`, fm, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    "Authorization" : `Bearer ${token}`
                }
            }).then(res => {
                console.log(res);
                this.setState({
                    visible: false,
                    img: null
                });
                this.getData();
            }).catch(err => {
                alert(err);
            })

        }
    };

    handleCancel = e => {
        this.setState({
            visible: false,
        });
    };
    handleEditOk = e => {
        let token = JSON.parse(localStorage.getItem('token'));

        console.log(this.state);

        if (this.state.edit_name.length > 0) {
            console.log('time: ' + this.state.time);
            console.log('edit time: ' + this.state.edit_time);

            let fm = new FormData();
            fm.append('img', this.state.img);
            fm.append('name', this.state.edit_name);
            fm.append('time', this.state.edit_time ? this.state.edit_time:null);
            fm.append('date', this.state.edit_date ? this.state.edit_date:null);
            fm.append('place', this.state.edit_place);
            fm.append('number_of_participants', this.state.edit_number_of_participants);
            fm.append('rate', this.state.edit_rate);

            axios.put(`${base_url}/festivals/${this.state.editid}`, fm,{
                headers: {
                    'Content-Type': 'multipart/form-data',
                    "Authorization" : `Bearer ${token}`
                }
            }).then(res => {
                this.setState({
                    editvisible: false,
                    img: null
                });
                this.getData();
            }).catch(err => {
                alert(err);
            })

        }
    };

    handleEditCancel = e => {
        this.setState({
            editvisible: false,
        });
    };

    onChange = e => {
        this.setState({
            [e.target.name]: e.target.value
        });
    };

    onNumberChange = name => value => {
        this.setState({
            [name]: value
        });
    };

    openEditModal = item => {
        this.setState({
            editvisible: true,
            editid: item.id,
            edit_name: item.name,
            imageUrl: img_url+'/'+item.image,
            edit_time: item.time,
            edit_date: item.date,
            edit_place: item.place,
            edit_number_of_participants: item.number_of_participants,
            edit_rate: item.rate,
        });
        console.log(item);
    };

    handleChange = info => {
        if (info.file.status === 'uploading') {
            this.setState({ imageLoading: true });
            return;
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            getBase64(info.file.originFileObj, imageUrl => {
                    this.setState({
                        imageUrl,
                        upload_img: info.file.originFileObj,
                        imageLoading: false,
                    });

                }
            );
        }
    };

    handleChange = (pagination, filters, sorter) => {
        console.log('Various parameters', pagination, filters, sorter);
        this.setState({
            filteredInfo: filters,
            sortedInfo: sorter,
        });
    };


    handleChange = info => {
        if (info.file.status === 'uploading') {
            this.setState({ imageLoading: true });
            return;
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            getBase64(info.file.originFileObj, imageUrl =>
                this.setState({
                    imageUrl,
                    loading: false,
                    img: info.file.originFileObj
                }),
            );
        }
    };

    getColumnSearchProps = dataIndex => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={node => {
                        this.searchInput = node;
                    }}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => this.handleSearch(selectedKeys, confirm)}
                    style={{ width: 188, marginBottom: 8, display: 'block' }}
                />
                <Button
                    type="primary"
                    onClick={() => this.handleSearch(selectedKeys, confirm)}
                    icon="search"
                    size="small"
                    style={{ width: 90, marginRight: 8 }}
                >
                    Search
                </Button>
                <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
                    Reset
                </Button>
            </div>
        ),
        filterIcon: filtered => (
            <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
        ),
        onFilter: (value, record) =>
            record[dataIndex]
                .toString()
                .toLowerCase()
                .includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: visible => {
            if (visible) {
                setTimeout(() => this.searchInput.select());
            }
        },
        render: text => (
            <Highlighter
                highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                searchWords={[this.state.searchText]}
                autoEscape
                textToHighlight={text?text.toString():'-'}
            />
        ),
    });

    handleSearch = (selectedKeys, confirm) => {
        confirm();
        this.setState({ searchText: selectedKeys[0] });
    };

    handleReset = clearFilters => {
        clearFilters();
        this.setState({ searchText: '' });
    };

    render() {
        const data = this.state.articles.map((item, i) => {

            let time = new Date(item.time);
            if(time) {
                time = time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds();
            }

            return {
                ...item,
                time: item.time ? item.time.substr(11, 8) : '',
                // date: item.date ? item.date : '',
                key: i
            }
        });

        const {visible, loading, editvisible} = this.state;

        const uploadButton = (
            <div>
                <Icon type={this.state.imageLoading ? 'loading' : 'plus'} />
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        const { imageUrl } = this.state;


        const columns = [
            {
                title: 'ID',
                key: 'id',
                dataIndex: 'id',
            },
            {
                title: 'Image',
                key: 'image',
                render: (text, record) => (
                    <span>
                      <img width="50px" src={img_url+record.image} alt={record.name}/>
                    </span>
                ),
            },
            {
                title: 'Name',
                dataIndex: 'name',
                key: 'name',
                ...this.getColumnSearchProps('name'),
            },
            {
                title: 'Time',
                dataIndex: 'time',
                key: 'time',
                ...this.getColumnSearchProps('time'),
            },
            {
                title: 'Date',
                dataIndex: 'date',
                key: 'date',
                ...this.getColumnSearchProps('date'),
            },
            {
                title: 'Place',
                dataIndex: 'place',
                key: 'place',
                ...this.getColumnSearchProps('place'),
            },
            {
                title: 'Number of participants',
                dataIndex: 'number_of_participants',
                key: 'number_of_participants',
                ...this.getColumnSearchProps('number_of_participants'),
            },
            {
                title: 'Rate',
                dataIndex: 'rate',
                key: 'rate',
                ...this.getColumnSearchProps('rate'),
            },
            {
                title: 'Actions',
                key: 'action',
                render: (text, record) => (
                    <span>
                        <a href="javascript:;" onClick={() => this.openEditModal(record)}>Edit</a>
                        <Divider type="vertical"/>
                        <a href="javascript:;" onClick={() => this.handleDelete(record.id)}>Delete</a>
                    </span>
                ),
            },
        ];
        return (
            <div>
                <Button type="primary" onClick={this.showModal} className={'mb-20'}>Add Festival</Button>
                <Modal
                    visible={visible}
                    title="Add Festival"
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
                        <Form.Item label="Name">
                            <Input placeholder="Enter name" onChange={this.onChange} name="name"
                                   value={this.state.name}/>
                        </Form.Item>

                        <Form.Item label="Date">
                            <MaskedInput placeholder="Enter date" mask="1111.11.11" onChange={this.onChange} name="date"
                                         value={this.state.date}/>
                        </Form.Item>

                        <Form.Item label="Time">
                            <MaskedInput placeholder="Enter time" mask="11:11:11" onChange={this.onChange} name="time"
                                         value={this.state.time}/>
                        </Form.Item>

                        <Form.Item label="Place">
                            <Input placeholder="Enter place" onChange={this.onChange} name="place"
                                   value={this.state.place}/>
                        </Form.Item>

                        <Form.Item label="Number of participants">
                            <InputNumber placeholder="Enter number of participants" min={0} onChange={this.onNumberChange('number_of_participants')}
                                         value={this.state.number_of_participants}/>
                        </Form.Item>

                        <Form.Item label="Rate">
                            <InputNumber placeholder="Enter rate" min={0} max={5} onChange={this.onNumberChange('rate')}
                                         value={this.state.rate}/>
                        </Form.Item>
                        <Form.Item label="Изображения Предпочитаемый Размер 500х650">
                            <Upload
                                name="avatar"
                                listType="picture-card"
                                className="avatar-uploader"
                                showUploadList={false}
                                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                                beforeUpload={beforeUpload}
                                onChange={this.handleChange}
                            >
                                {imageUrl ? <img src={imageUrl} alt="avatar" /> : uploadButton}
                            </Upload>
                        </Form.Item>
                    </Form>
                </Modal>

                <Modal
                    visible={editvisible}
                    title="Edit Festival"
                    onOk={this.handleEditOk}
                    onCancel={this.handleEditCancel}
                    footer={[
                        <Button key="back" onClick={this.handleEditCancel}>
                            Cancel
                        </Button>,
                        <Button key="submit" type="primary" loading={loading} onClick={this.handleEditOk}>
                            Save
                        </Button>,
                    ]}
                >

                    <Form layout={'vertical'}>
                        <Form.Item label="Name">
                            <Input placeholder="Enter name" onChange={this.onChange} name="edit_name"
                                   value={this.state.edit_name}/>
                        </Form.Item>

                        <Form.Item label="Date">
                            <MaskedInput placeholder="Enter date" mask="1111.11.11" onChange={this.onChange} name="edit_date"
                                         value={this.state.edit_date}/>
                        </Form.Item>

                        <Form.Item label="Time">
                            <MaskedInput placeholder="Enter time" mask="11:11:11" onChange={this.onChange} name="edit_time"
                                         value={this.state.edit_time}/>
                        </Form.Item>

                        <Form.Item label="Place">
                            <Input placeholder="Enter place" onChange={this.onChange} name="edit_place"
                                   value={this.state.edit_place}/>
                        </Form.Item>

                        <Form.Item label="Number of participants">
                            <InputNumber placeholder="Enter number of participants" min={0} onChange={this.onNumberChange('edit_number_of_participants')}
                                         value={this.state.edit_number_of_participants}/>
                        </Form.Item>

                        <Form.Item label="Rate">
                            <InputNumber placeholder="Enter rate" min={0} max={5} onChange={this.onNumberChange('edit_rate')}
                                         value={this.state.edit_rate}/>
                        </Form.Item>
                        <Form.Item label="Изображения Предпочитаемый Размер 500х650
">
                            <Upload
                                name="avatar"
                                listType="picture-card"
                                className="avatar-uploader"
                                showUploadList={false}
                                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                                beforeUpload={beforeUpload}
                                onChange={this.handleChange}
                            >
                                {imageUrl ? <img src={imageUrl} alt="avatar" /> : uploadButton}
                            </Upload>
                        </Form.Item>
                    </Form>
                </Modal>

                <Table columns={columns} dataSource={data}/>


            </div>
        )
    }
}

Articles.propTypes = {};
export default withRouter(Articles);