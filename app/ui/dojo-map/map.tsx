'use client';

import { useState, useEffect } from 'react';
// 1. 导入 MapMouseEvent 类型

import Map, { Marker, NavigationControl, Popup, MapMouseEvent } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';

interface Dojo {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
}

export default function DojoMap() {
    const [dojos, setDojos] = useState<Dojo[]>([]);
    const [newDojoPoint, setNewDojoPoint] = useState<{ lng: number, lat: number } | null>(null);
    const [selectedDojo, setSelectedDojo] = useState<Dojo | null>(null);

    useEffect(() => {
        setDojos([{ id: 1, name: "黑带道场", latitude: 31.23, longitude: 121.47 }]);
    }, []);

    // 2. 为 e 指定 MapMouseEvent 类型
    const handleMapClick = (e: MapMouseEvent) => {
        const { lng, lat } = e.lngLat;
        setNewDojoPoint({ lng, lat });
    };

    return (
        <div className="relative h-[600px] w-full rounded-xl overflow-hidden shadow-inner bg-gray-100">
            <Map
                initialViewState={{ longitude: 121.47, latitude: 31.23, zoom: 10 }}
                mapStyle="mapbox://styles/mapbox/streets-v12"
                mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
                onClick={handleMapClick}
            >
                <NavigationControl position="top-right" />

                {dojos.map(dojo => (
                    <Marker
                        key={dojo.id}
                        longitude={dojo.longitude}
                        latitude={dojo.latitude}
                        color="#3b82f6"
                    >
                        {/* 3. 在 Marker 内部放置按钮触发点击，避免事件冒泡冲突 */}
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                setSelectedDojo(dojo);
                            }}
                            className="cursor-pointer"
                        >
                            <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </Marker>
                ))}

                {newDojoPoint && (
                    <Marker longitude={newDojoPoint.lng} latitude={newDojoPoint.lat} color="#ef4444" draggable />
                )}

                {selectedDojo && (
                    <Popup
                        longitude={selectedDojo.longitude}
                        latitude={selectedDojo.latitude}
                        anchor="bottom"
                        onClose={() => setSelectedDojo(null)}
                        closeOnClick={false}
                    >
                        <div className="p-2 text-gray-900 min-w-[100px]">
                            <h3 className="font-bold border-b mb-1">{selectedDojo.name}</h3>
                            <p className="text-xs text-gray-500">坐标: {selectedDojo.latitude.toFixed(2)}, {selectedDojo.longitude.toFixed(2)}</p>
                            <button className="mt-2 text-blue-600 text-xs font-semibold hover:underline block">查看道场详情 →</button>
                        </div>
                    </Popup>
                )}
            </Map>

            {/* 提示栏 */}
            {!newDojoPoint && (
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-2 rounded shadow text-xs text-gray-600">
                    💡 点击地图任意位置开始添加新道场
                </div>
            )}

            {newDojoPoint && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white p-4 rounded-2xl shadow-2xl border border-gray-100 flex items-center gap-4 animate-in fade-in slide-in-from-bottom-4">
                    <div className="flex flex-col">
                        <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">选定坐标</span>
                        <span className="text-sm font-mono text-gray-700">{newDojoPoint.lng.toFixed(4)}, {newDojoPoint.lat.toFixed(4)}</span>
                    </div>
                    <button
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-medium transition-colors shadow-lg shadow-blue-200"
                        onClick={() => alert('跳转到 .NET 后端表单页面')}
                    >
                        创建此道场
                    </button>
                    <button
                        onClick={() => setNewDojoPoint(null)}
                        className="text-gray-400 hover:text-gray-600 px-2"
                    >
                        取消
                    </button>
                </div>
            )}
        </div>
    );
}