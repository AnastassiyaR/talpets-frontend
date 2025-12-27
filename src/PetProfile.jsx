import { useState, useEffect } from "react";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import ProfileBar from "./components/ProfileBar.jsx";
import axios, {getUserId} from './utils/auth.jsx';
import "./PetProfile.css";

function PetProfilePage() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [pets, setPets] = useState([]);
    const [selectedPetId, setSelectedPetId] = useState(null);
    const [editData, setEditData] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('catalog');

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    useEffect(() => {
        const loadPets = async () => {
            try {
                const userId = getUserId();
                const response = await axios.get(`/api/pets?userId=${userId}`);
                setPets(response.data);
            } catch {
                alert("Failed to load pets");
            } finally {
                setLoading(false);
            }
        };

        loadPets();
    }, []);

    const handleAddPet = async () => {
        try {
            const userId = getUserId();
            const newPet = {
                name: "",
                breed: "",
                gender: "",
                birthday: "",
                age: "",
                description: "",
                photo: ""
            };

            const response = await axios.post(`/api/pets?userId=${userId}`, newPet);
            const savedPet = response.data;

            setPets([...pets, savedPet]);
            setSelectedPetId(savedPet.id);
            setEditData(savedPet);
            setIsEditing(true);
            setViewMode('detail');
        } catch {
            alert("Failed to add pet");
        }
    };

    const handleDeletePet = async (petId) => {
        if (globalThis.confirm("Are you sure you want to delete this pet?")) {
            try {
                const userId = getUserId();
                await axios.delete(`/api/pets/${petId}?userId=${userId}`);
                const updatedPets = pets.filter(pet => pet.id !== petId);
                setPets(updatedPets);
                setViewMode('catalog');
                setSelectedPetId(null);
            } catch {
                alert("Failed to delete pet");
            }
        }
    };

    const handleViewPet = (petId) => {
        setSelectedPetId(petId);
        setViewMode('detail');
        setIsEditing(false);
    };

    const handleBackToCatalog = () => {
        setViewMode('catalog');
        setSelectedPetId(null);
        setIsEditing(false);
    };

    const handleEditToggle = () => {
        const currentPet = pets.find(p => p.id === selectedPetId);
        setIsEditing(!isEditing);
        setEditData({ ...currentPet });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditData((prev) => ({ ...prev, [name]: value }));
    };

    const calculateDimensions = (width, height, maxWidth = 400, maxHeight = 400) => {
        if (width > height) {
            if (width > maxWidth) {
                height *= maxWidth / width;
                width = maxWidth;
            }
        } else if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
        }
        return { width, height };
    };

    const compressImage = (img) => {
        const canvas = document.createElement('canvas');
        const { width, height } = calculateDimensions(img.width, img.height);

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        return canvas.toDataURL('image/jpeg', 0.7);
    };

    const loadImage = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const img = new Image();
                img.onload = () => resolve(img);
                img.onerror = reject;
                img.src = reader.result;
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    const handlePhotoChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const img = await loadImage(file);
            const compressedDataUrl = compressImage(img);
            setEditData((prev) => ({ ...prev, photo: compressedDataUrl }));
        } catch {
            alert('Error processing image');
        }
    };

    const handleSave = async () => {
        try {
            const userId = getUserId();
            await axios.put(`/api/pets/${selectedPetId}?userId=${userId}`, editData);

            const updatedPets = pets.map(pet =>
                pet.id === selectedPetId ? editData : pet
            );
            setPets(updatedPets);
            setIsEditing(false);
        } catch {
            alert("Failed to update pet");
        }
    };

    const handleCancel = () => {
        const currentPet = pets.find(p => p.id === selectedPetId);
        if (!currentPet.name && !currentPet.breed) {
            handleDeletePet(selectedPetId);
        } else {
            setEditData({ ...currentPet });
            setIsEditing(false);
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <span>Loading...</span>
            </div>
        );
    }

    const selectedPet = pets.find(p => p.id === selectedPetId);

    return (
        <div id="profile-container">
            <Navbar />

            <div id="profile-content">
                <ProfileBar
                    className={isMenuOpen ? 'show' : ''}
                    onClose={toggleMenu}
                />

                <div id="profile-button-container">
                    {!isMenuOpen && (
                        <button id="profile-button" type="button" onClick={toggleMenu}>
                            Profile
                        </button>
                    )}
                </div>

                <div id="info-container">
                    <h1 style={{textAlign: 'center'}}>YOUR PETS</h1>

                    {viewMode === 'catalog' && (
                        <div>
                            <div id="category">
                                {pets.map(pet => (
                                    <div id="pet-card" key={pet.id} onClick={() => handleViewPet(pet.id)}>
                                        <div id="pet-photo">
                                            {pet.photo ? (
                                                <img src={pet.photo} alt={pet.name} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                                            ) : (
                                                '🦊'
                                            )}
                                        </div>

                                        <div id="pet-info">
                                            <h3>{pet.name || "Unnamed Pet"}</h3>

                                            <div id="pet-description">
                                                {pet.breed && <div><strong>Breed:</strong> {pet.breed}</div>}
                                                {pet.age && <div><strong>Age:</strong> {pet.age}</div>}
                                                {pet.gender && <div><strong>Gender:</strong> {pet.gender}</div>}
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                <button
                                    id="new-pet-card"
                                    onClick={handleAddPet}
                                >
                                    <div id="plus">➕</div>
                                    <div id="add-pet">Add New Pet</div>
                                </button>
                            </div>

                            {pets.length === 0 && (
                                <div id="no-pets">
                                    <div className="icon">🐾</div>
                                    <p className="title">No pets yet</p>
                                    <p className="subtitle">Click &#34;Add New Pet&#34; to create your first pet profile</p>
                                </div>
                            )}
                        </div>
                    )}

                    {viewMode === 'detail' && selectedPet && (
                        <div>
                            <button id="back-to-catalog" onClick={handleBackToCatalog}>
                                Back to Catalog
                            </button>

                            <div id="pet-profile-value">
                                <div id="profile-pic">
                                    <div
                                        className="pet-profile-picture"
                                        style={{
                                            backgroundImage: (isEditing ? editData.photo : selectedPet?.photo) && `url(${isEditing ? editData.photo : selectedPet?.photo})`,
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center'
                                        }}
                                    >
                                        {!(isEditing ? editData.photo : selectedPet?.photo) && (
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    width: '100%',
                                                    height: '100%',
                                                    fontSize: '120px'
                                                }}
                                            >
                                                🐇
                                            </div>
                                        )}
                                    </div>


                                    {isEditing && (
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handlePhotoChange}
                                            style={{ marginTop: '10px', fontSize: '12px' }}
                                        />
                                    )}
                                </div>

                                <div>
                                    <div className="greeting">
                                        {isEditing ? (
                                            <div>
                                                <div id="profile-edit-item">
                                                    <strong>Name:</strong>
                                                    <input
                                                        name="name"
                                                        value={editData.name}
                                                        onChange={handleChange}
                                                        placeholder="Enter name"
                                                    />
                                                </div>

                                                <div id="profile-description">
                                                    <strong>Description:</strong>
                                                    <textarea
                                                        name="description"
                                                        value={editData.description}
                                                        onChange={handleChange}
                                                        placeholder="Describe yourself..."
                                                        rows="3"
                                                    />
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="profile-greeting">
                                                <h2>Hello! {selectedPet.name ? `My name is ${selectedPet.name}` : "I dont have name yet 😶‍🌫️"}!</h2>
                                                <p>{selectedPet.description || "There is no description yet..."}</p>
                                            </div>
                                        )}
                                    </div>

                                    {!isEditing && (
                                        <div className="profile-details">
                                            <ul>
                                                <li><strong>Breed:</strong> {selectedPet.breed || "-"}</li>
                                                <li><strong>Age:</strong> {selectedPet.age || "-"}</li>
                                                <li><strong>Gender:</strong> {selectedPet.gender || "-"}</li>
                                                <li><strong>Birthday:</strong> {selectedPet.birthday ? new Date(selectedPet.birthday).toLocaleDateString('en-UK') : "-"}</li>
                                            </ul>
                                        </div>
                                    )}

                                    {isEditing && (
                                        <div>
                                            <div id="profile-edit-item">
                                                <strong>Breed:</strong>
                                                <input
                                                    name="breed"
                                                    value={editData.breed}
                                                    onChange={handleChange}
                                                    placeholder="Enter breed"
                                                />
                                            </div>

                                            <div id="profile-edit-item">
                                                <strong>Age:</strong>
                                                <input
                                                    name="age"
                                                    value={editData.age}
                                                    onChange={handleChange}
                                                    placeholder="For example: 3 years old"
                                                />
                                            </div>

                                            <div id="profile-edit-item">
                                                <strong>Gender:</strong>
                                                <select
                                                    name="gender"
                                                    value={editData.gender}
                                                    onChange={handleChange}
                                                >
                                                    <option value="">Choose gender</option>
                                                    <option value="Male">Male</option>
                                                    <option value="Female">Female</option>
                                                </select>
                                            </div>

                                            <div id="profile-edit-item">
                                                <strong>Birthday:</strong>
                                                <input
                                                    type="date"
                                                    name="birthday"
                                                    max={new Date().toISOString().split("T")[0]}
                                                    value={editData.birthday}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    <div className="pet-buttons">
                                        {isEditing ? (
                                            <>
                                                <button type="button" className="pet-btn pet-btn-save" onClick={handleSave}>
                                                    Save
                                                </button>
                                                <button type="button" className="pet-btn pet-btn-cancel" onClick={handleCancel}>
                                                    Cancel
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button type="button" className="pet-btn pet-btn-edit" onClick={handleEditToggle}>
                                                    Edit
                                                </button>
                                                <button
                                                    type="button"
                                                    className="pet-btn pet-btn-delete"
                                                    onClick={() => handleDeletePet(selectedPetId)}
                                                >
                                                    Delete
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default PetProfilePage;
