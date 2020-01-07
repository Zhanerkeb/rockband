import React, {Component} from 'react'
import {withRouter} from 'react-router-dom';
import {Table, Divider, Button, Modal, Input, Form, message, Icon, Upload, InputNumber, Select} from 'antd';
import MaskedInput from 'antd-mask-input'
import axios from "axios";
import {base_url, img_url} from "../config";
import Highlighter from 'react-highlight-words';

const { TextArea } = Input;
const {Option} = Select;


function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
};

function beforeUpload(file) {
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
            rock_bands: [],
            festivals: [],
            songs: [],
            visible: false,
            imageUrl: null,
            loading: false,
            img: null,
            searchText: '',
            filteredInfo: null,
            sortedInfo: null,

            duration: '',
            order: '',
            rate: '',
            image: '',
            festival_id: '',
            rock_band_id: '',
            song_id: '',

            edit_duration: '',
            edit_order: '',
            edit_rate: '',
            edit_image: '',
            edit_festival_id: '',
            edit_rock_band_id: '',
            edit_song_id: '',

            editid: '',
            editvisible: false
        }
    }

    componentDidMount() {
        this.getData();
        this.getAddData();
    }

    showModal = () => {
        this.setState({
            visible: true,

            imageUrl: null,
            duration: '',
            order: '',
            rate: '',
            image: '',
            festival_id: '',
            rock_band_id: '',
            song_id: '',
        });
    };

    getData = e => {
        let token = JSON.parse(localStorage.getItem('token'));
        axios.get(`${base_url}/performances`, { headers: {"Authorization" : `Bearer ${token}`} }).then(res => {
            this.setState({articles: res.data});
            console.log(res.data);
        })
    };

    getAddData = e => {
        let token = JSON.parse(localStorage.getItem('token'));

        axios.get(`${base_url}/rock-bands/with-songs`, { headers: {"Authorization" : `Bearer ${token}`} }).then(res => {
            this.setState({rock_bands: res.data});
        });

        axios.get(`${base_url}/festivals`, { headers: {"Authorization" : `Bearer ${token}`} }).then(res => {
            this.setState({festivals: res.data});
            console.log(res.data);
        })

    };


    handleDelete = id => {
        let token = JSON.parse(localStorage.getItem('token'));

        axios.delete(`${base_url}/performances/${id}`, { headers: {"Authorization" : `Bearer ${token}`} }).then(res => {
            this.getData();
        }).catch(err => {
            alert(err);
        })
    };

    handleOk = e => {
        let token = JSON.parse(localStorage.getItem('token'));

        if (this.state.order) {

            let fm = new FormData();
            fm.append('img', this.state.img);
            fm.append('duration', this.state.duration);
            fm.append('order', this.state.order);
            fm.append('rate', this.state.rate);
            fm.append('festival_id', this.state.festival_id);
            fm.append('rock_band_id', this.state.rock_band_id);
            fm.append('song_id', this.state.song_id);

            axios.post(`${base_url}/performances`, fm, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    "Authorization" : `Bearer ${token}`
                }
            }).then(res => {
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

        console.log({edit: this.state});

        if (this.state.edit_order) {
            let fm = new FormData();
            fm.append('img', this.state.img);
            fm.append('duration', this.state.edit_duration);
            fm.append('order', this.state.edit_order);
            fm.append('rate', this.state.edit_rate);
            fm.append('festival_id', this.state.edit_festival_id);
            fm.append('rock_band_id', this.state.edit_rock_band_id);
            fm.append('song_id', this.state.edit_song_id);

            axios.put(`${base_url}/performances/${this.state.editid}`, fm,{
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

    onSelectFestival = (value) => {
        this.setState({
            festival_id: value
        });
    };

    onSelectFestivalUpdate = (value) => {
        this.setState({
            edit_festival_id: value
        });
    };

    onSelectRockBand = (value) => {
        this.setState({
            rock_band_id: value,
            songs: this.state.rock_bands.filter(band => band.id === value)[0].Songs
        });
    };

    onSelectRockBandUpdate = (value) => {
        this.setState({
            edit_rock_band_id: value,
            songs: this.state.rock_bands.filter(band => band.id === value)[0].Songs
        });
    };

    onSelectSong = (value) => {
        this.setState({
            song_id: value
        });
    };

    onSelectSongUpdate = (value) => {
        this.setState({
            edit_song_id: value
        });
    };

    openEditModal = item => {
        this.setState({
            editvisible: true,
            editid: item.id,
            edit_duration: item.duration,
            edit_order: item.order?item.order:'',
            edit_rate: item.rate,
            edit_festival_id: item.festival_id,
            edit_rock_band_id: item.rock_band_id,
            edit_song_id: item.song_id,
            imageUrl: img_url+'/'+item.image
        });

        this.setState({songs: this.state.rock_bands.filter(band => band.id === item.rock_band_id)[0].Songs})
    };

    handleChange = (pagination, filters, sorter) => {
        // console.log('Various parameters', pagination, filters, sorter);
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
            let rock_band = this.state.rock_bands && item.rock_band_id ? this.state.rock_bands.filter(band => band.id === item.rock_band_id)[0] : [];
            let festival = this.state.festivals && item.festival_id ? this.state.festivals.filter(festivall => festivall.id === item.festival_id)[0]:[];
            return {
                ...item,
                festival: festival ? festival.name : '',
                rock_band: rock_band ? rock_band.name : '',
                song: rock_band && item.song_id ? rock_band.Songs.filter(song => song.id === item.song_id)[0].name : '',
                key: i
            }

        });

        const {visible, loading, editvisible, rock_bands, festivals, songs} = this.state;

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
            // {
            //     title: 'Image',
            //     key: 'image',
            //     render: (text, record) => (
            //         <span className={'rock-band-image'}>
            //           <img width="50px" src={img_url+record.image} alt={record.name}/>
            //         </span>
            //     ),
            // },
            {
                title: 'Festival',
                dataIndex: 'festival',
                key: 'festival',
                ...this.getColumnSearchProps('festival'),
            },
            {
                title: 'Rock Band',
                dataIndex: 'rock_band',
                key: 'rock_band',
                ...this.getColumnSearchProps('rock_band'),
            },
            {
                title: 'Song',
                dataIndex: 'song',
                key: 'song',
                ...this.getColumnSearchProps('song'),
            },
            {
                title: 'Rate',
                dataIndex: 'rate',
                key: 'rate',
                ...this.getColumnSearchProps('rate'),
            },
            {
                title: 'Duration',
                dataIndex: 'duration',
                key: 'duration',
                ...this.getColumnSearchProps('duration'),
            },
            {
                title: 'Order',
                dataIndex: 'order',
                key: 'order',
                ...this.getColumnSearchProps('order'),
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

        let festival_options;
        if (festivals && festivals.length > 0) {
            festival_options = festivals.map((item, i) => (
                <Option value={item.id} key={i}>{item.name}</Option>
            ))
        }

        let rock_band_options;
        if (rock_bands && rock_bands.length > 0) {
            rock_band_options = rock_bands.map((item, i) => (
                <Option value={item.id} key={i}>{item.name}</Option>
            ))
        }

        let song_options;
        if (songs && songs.length > 0) {
            song_options = songs.map((item, i) => (
                <Option value={item.id} key={i}>{item.name}</Option>
            ))
        }
        return (
            <div>
                <Button type="primary" onClick={this.showModal} className={'mb-20'}>Add Performance</Button>
                <Modal
                    visible={visible}
                    title="Add Performance"
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    footer={[
                        <Button key="back" onClick={this.handleCancel}>
                            Cancel
                        </Button>,
                        <Button key="submit" type="primary" loading={loading} onClick={this.handleOk}>
                            Save
                        </Button>,
                    ]}
                >

                    <Form layout={'vertical'}>

                        <Form.Item label="Rate">
                            <InputNumber placeholder="Enter rate" min={0} max={5} onChange={this.onNumberChange('rate')}
                                         value={this.state.rate}/>
                        </Form.Item>

                        <Form.Item label="Duration">
                            <InputNumber placeholder="Enter duration" min={0} max={500} onChange={this.onNumberChange('duration')}
                                         value={this.state.duration}/>
                        </Form.Item>

                        <Form.Item label="Order">
                            <InputNumber placeholder="Enter order" min={0} max={100} onChange={this.onNumberChange('order')}
                                         value={this.state.order}/>
                        </Form.Item>

                        <Form.Item label="Festival">
                            <Select onChange={this.onSelectFestival} name="festival_id" value={this.state.festival_id}>
                                {festival_options}
                            </Select>
                        </Form.Item>

                        <Form.Item label="Rock Band">
                            <Select onChange={this.onSelectRockBand} name="rock_band_id" value={this.state.rock_band_id}>
                                {rock_band_options}
                            </Select>
                        </Form.Item>

                        <Form.Item label="Song">
                            <Select onChange={this.onSelectSong} name="song_id" value={this.state.song_id}>
                                {song_options}
                            </Select>
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
                    title="Edit Performance"
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

                        <Form.Item label="Rate">
                            <InputNumber placeholder="Enter rate" min={0} max={5} onChange={this.onNumberChange('edit_rate')}
                                         value={this.state.edit_rate}/>
                        </Form.Item>

                        <Form.Item label="Duration">
                            <InputNumber placeholder="Enter duration" min={0} max={500} onChange={this.onNumberChange('edit_duration')}
                                         value={this.state.edit_duration}/>
                        </Form.Item>

                        <Form.Item label="Order">
                            <InputNumber placeholder="Enter order" min={0} max={100} onChange={this.onNumberChange('edit_order')}
                                         value={this.state.edit_order}/>
                        </Form.Item>

                        <Form.Item label="Festival">
                            <Select onChange={this.onSelectFestivalUpdate} name="edit_festival_id" value={this.state.edit_festival_id}>
                                {festival_options}
                            </Select>
                        </Form.Item>

                        <Form.Item label="Rock Band">
                            <Select onChange={this.onSelectRockBandUpdate} name="edit_rock_band_id" value={this.state.edit_rock_band_id}>
                                {rock_band_options}
                            </Select>
                        </Form.Item>

                        <Form.Item label="Song">
                            <Select onChange={this.onSelectSongUpdate} name="edit_song_id" value={this.state.edit_song_id}>
                                {song_options}
                            </Select>
                        </Form.Item>
                        <Form.Item label="Image
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
                                {imageUrl ? <img src={imageUrl} alt="image" /> : uploadButton}
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