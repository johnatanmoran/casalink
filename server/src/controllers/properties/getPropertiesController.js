import getPool from '../../db/getPool.js';

const getPropertiesController = async (req, res, next) => {
	const {
		minPrice = 0,
		maxPrice = null,
		bedrooms = null,
		bathrooms = null,
		minOwnerRating = 0,
		energyCertificate = null,
		sortBy = 'updatedAt',
		order = 'DESC',
		limit = 10,
		page = 1,
	} = req.body;

	const offset = (page - 1) * limit;

	console.log({
		minPrice,
		maxPrice,
		bedrooms,
		bathrooms,
		energyCertificate,
		minOwnerRating,
		sortBy,
		order,
		limit,
		offset,
	});

	// Validar `sortBy` y `order` para evitar SQL Injection
	const validSortBy = [
		'price',
		'bedrooms',
		'bathrooms',
		'ownerRating',
		'createdAt',
	];
	const validOrder = ['ASC', 'DESC'];

	const sortColumn = validSortBy.includes(sortBy) ? sortBy : 'createdAt';
	const sortOrder = validOrder.includes(order.toUpperCase())
		? order.toUpperCase()
		: 'DESC';

	try {
		const pool = await getPool();
		const query = `
				SELECT
					p.id AS propertyId,
					p.propertyTitle,
					p.propertyType,
					p.description,
					p.zipCode,
					p.bedrooms,
					p.bathrooms,
					p.price,
					p.status,
					p.hasEnergyCert,
					p.createdAt AS propertyCreatedAt,
					u.name AS ownerName,
					JSON_OBJECT(
						'ownerId', u.id,
						'ownerName', u.name,
						'lastName', u.lastName,
						'avatarUrl', u.avatarUrl,
						'isDocsVerified', u.isDocsVerified,
						'averageRating', u.averageRating,
						'totalReviews', u.totalReviews
					) AS ownerInfo,
					u.averageRating AS ownerRating,
					(SELECT pi.imageUrl FROM images pi WHERE pi.propertyId = p.id ORDER BY pi.sortIndex ASC LIMIT 1) AS mainImage
				FROM properties p
				JOIN users u ON p.ownerId = u.id
				LEFT JOIN reviews r ON u.id = r.reviewedId
				WHERE
					( ? IS NULL OR p.price BETWEEN ? AND ? )
					AND ( ? IS NULL OR p.bedrooms >= ? )
					AND ( ? IS NULL OR p.bathrooms >= ? )
					AND ( ? IS NULL OR p.hasEnergyCert = 1 )
				GROUP BY p.id
				HAVING ( ? IS NULL OR ownerRating >= ? )
				ORDER BY p.${sortColumn} ${sortOrder}
				LIMIT ? OFFSET ?;
			`;

		const values = [
			minPrice,
			minPrice,
			maxPrice,
			bedrooms,
			bedrooms,
			bathrooms,
			bathrooms,
			energyCertificate,
			minOwnerRating,
			minOwnerRating,
			limit,
			offset,
		];

		const [results] = await pool.query(query, values);

		console.log(pool.format(query, values));

		/*
		console.log('minPrice:', minPrice);
		console.log('maxPrice', maxPrice);
		console.log('bedrooms', bedrooms);
		console.log('bathrooms', bathrooms);
		console.log('energyCertificate', energyCertificate);
		console.log('minOwnerRating', minOwnerRating);
		console.log('SortBy', sortBy);
		console.log('order', order);
		console.log('Resultados:', results);
		*/

		res.json(results);
	} catch (error) {
		console.error('Error ejecutando la consulta:', error);
		next(error);
	}
};

export default getPropertiesController;
