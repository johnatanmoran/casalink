import getPool from '../../db/getPool.js';
const selectPropertyByIdModel = async (propertyId) => {
	const pool = await getPool();

	const [properties] = await pool.query(
		`
			SELECT p.id,
			ownerId,
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
			JSON_OBJECT(
					'ownerId', u.id,
					'ownerName', u.name,
					'lastName', u.lastName,
					'avatarUrl', u.avatarUrl,
					'isDocsVerified', u.isDocsVerified,
					'averageRating', u.averageRating,
					'totalReviews', u.totalReviews
				) AS ownerInfo,
			COALESCE(AVG(r.rating),0) AS avgRating
			FROM properties p
			JOIN users u ON p.ownerId = u.id
			LEFT JOIN reviews r ON r.reviewedId=u.id
			WHERE p.id=?`,
		[propertyId]
	);

	const [images] = await pool.query(
		`
			SELECT imageUrl,sortIndex,fileType FROM images WHERE propertyId=?
		`,
		[propertyId]
	);

	//Creamos una propiedad a properties, para manejar mejor las imagenes.
	properties[0].images = images;

	properties[0].avgRating = Number(properties[0].avgRating);

	return properties[0];
};
export default selectPropertyByIdModel;
