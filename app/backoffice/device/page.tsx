'use client';

import {useState, useEffect} from 'react';
import config from '@/app/config';
import Swal from 'sweetalert2';
import axios from 'axios';
import Modal from '@/app/components/modal';
import dayjs from 'dayjs';

export default function Page() {
    const [devices, setDevices] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [barcode, setBarcode] = useState('');
    const [serial, setSerial] = useState('');
    const [name, setName ] = useState('');
    const [expireDate, setExpireDate] = useState('');
    const [remark, setRemark] = useState('');
    const [id, setId] = useState(0);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData  = async () => {
        try {
            const response = await axios.get(`${config.apiUrl}/api/device/list`);
            setDevices(response.data);
        } catch (error: unknown) {
            if (error instanceof Error) {
                Swal.fire({
                    icon: 'error',
                    title: 'ผิดพลาด',
                    text: error.message
                });
            }
        }
    }
    const handleShowModal = () => {
        setShowModal(true);
    }
    const handleCloseModal = () => {
        setShowModal(false);
    }
    const handleSave = async () => {
        try {
        const payload = {
            barcode: barcode,
            serial: serial,
            name: name,
            expireDate: new Date(expireDate),
            remark: remark
        }

       
        if (id == 0) {
            await axios.post(config.apiUrl + '/api/device/create', payload);
        } else {
            await axios.put(config.apiUrl + '/api/device/update/' + id, payload);
        }
            setShowModal(false);
            setBarcode('');
            setSerial('');
            setName('');
            setExpireDate('');
            setRemark('');
            setId(0);
            fetchData();
       } catch (error: unknown) {
            if (error instanceof Error) {
                Swal.fire({
                    icon: 'error',
                    title: 'ผิดพลาด',
                    text: error.message,
                });
            }
       }
    }

    const handleEdit = (item:any) => {
        setId(item.id);
        setBarcode(item.barcode);
        setSerial(item.serial);
        setName(item.name);
        setExpireDate(item.expireDate);
        setRemark(item.remark);
        
        setShowModal(true);
    }

    const handleDelete = async (id:string) => {
        try {
            const button = await config.confirmDialog();
            if (button.isConfirmed) {
                await axios.delete(config.apiUrl + '/api/device/remove/' + id);
                fetchData();
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: error.message
                });
            }
        }
    }

    return (
        <div className='card'>
            <h1>ทะเบียนวัสดุ อุปกรณ์</h1>
            <div className= "card-body">
                <button className="btn btn-primary" onClick={handleShowModal}>
                    <i className="fa-solid fa-plus mr-2"></i>
                    เพิ่มข้อมูล
                </button>
                
                <table className="table ">
                    <thead>
                        <tr>
                            <th>ชื่อวัสดุ</th>
                            <th>barcode</th>
                            <th>serial</th>
                            <th>วันหมดประกัน</th>
                            <th>หมายเหตุ</th>
                            <th style = {{width: '130px'}}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {devices.map((item: any ) => (
                            <tr key={item.id}>
                                <td>{item.name}</td>
                                <td>{item.barcode}</td>
                                <td>{item.serial}</td>
                                <td>{dayjs(item.expire_data).format('DD/MM/YYYY')}</td>
                                <td>{item.remark}</td>
                                <td className="text-center">
                                    <button className="btn-edit" onClick={() => handleEdit(item)}>
                                    <i className='fa-solid fa-pen-to-square'></i>
                                    </button>
                                    <button className="btn-delete" onClick={() => handleDelete(item.id)}>
                                        <i className="fa-solid fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

            </div>
                    <Modal title="เพิ่มรายการ" isOpen={showModal} onClose={handleCloseModal} >
                        <div>Barcode</div>
                        <input type="text" className="form-control" value={barcode} 
                            onChange={(e) => setBarcode(e.target.value)}
                        />
                        <div className="mt-3">Serial</div>
                        <input type="text" className='form-control' value={serial}
                            onChange={(e) => setSerial(e.target.value)}
                        />
                        <div className="mt-3">ชิ่อวัสดุอุปกรณ์</div>
                        <input type="text" className="form-control" value={name} 
                            onChange={(e) => setName(e.target.value)}
                        />
                        <div>วันหมดประกัน</div>
                        <input type="date" className="form-control" value={expireDate}
                            onChange={(e) => setExpireDate(e.target.value)}
                        />
                        <div className="mt-3">หมายเหตุ</div>
                        <input type="text" className="form-control" value={remark}
                            onChange={(e) => setRemark(e.target.value)}
                        />
                 
                            <button className="btn btn-primary mt-3" onClick={handleSave}>
                                <i className="fa-solid fa-check mr-2"></i>
                                บันทึก
                            </button>
                    
                    </Modal>
        </div>
    );
}