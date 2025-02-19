import getPool from '../../db/getPool.js';
const selectPropertyByIdModel = async (propertyId) => {
	const pool = await getPool();

	const [properties] = await pool.query(
		`
        SELECT p.id,
         p.propertyTitle,
         p.propertyType,
         p.description,
         p.price,
        p.addressLocality,
        p.addressStreet,
        p.addressNumber,
        p.addressFloor,
        p.hasEnergyCert,
        p.zipCode,
        p.location,
        p.squareMeters,
        p.bedrooms,
        p.bathrooms,
        p.status,
        u.id,
        u.name,
        u.lastName,
        u.avatarUrl,
        COALESCE(AVG(r.rating),0) AS avgRating
        
         FROM properties p
         JOIN users u ON p.ownerId = u.id
         LEFT JOIN reviews r ON r.reviewedId=u.id
         WHERE p.id=?`,
		[propertyId]
	);

	const [images] = await pool.query(
		`
        SELECT id,imageUrl FROM images WHERE propertyId=?`,
		[properties[0].id]
	);
	//Creamos una propiedad a properties, para manejar mejor las imagenes.
	properties[0].images = images;

	properties[0].avgRating = Number(properties[0].avgRating);

	return properties[0];
};
export default selectPropertyByIdModel;
