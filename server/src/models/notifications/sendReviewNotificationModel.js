import getPool from '../../db/getPool.js';

const sendReviewNotificationsModel = async (
	reviewerId,
	reviewedId,
	propertyTitle,
	tenantName,
	tenantId,
	ownerName,
	propertyId,
	rating
) => {
	const pool = await getPool();

	let reviewedName, reviewerName;

	if (reviewerId === tenantId) {
		reviewerName = tenantName;
		reviewedName = ownerName;
	} else {
		reviewerName = ownerName;
		reviewedName = tenantName;
	}

	const reviewerMessage = `Has dejado una reseña, por la propiedad ${propertyTitle}, en el perfil de ${reviewedName}.`;
	const reviewedMessage = `${reviewerName} ha dejado una reseña de ${rating} ⭐ en tu perfil por la propiedad ${propertyTitle}.`;

	const notifications = [
		{ userId: reviewerId, propertyId, message: reviewerMessage },
		{ userId: reviewedId, propertyId, message: reviewedMessage },
	];

	const values = notifications
		.map(() => "(?, ?, ?, 'review', 'approved')")
		.join(', ');
	const params = notifications.flatMap((n) => [
		n.userId,
		n.propertyId,
		n.message,
	]);

	const [result] = await pool.query(
		`
			INSERT INTO notifications (userId, propertyId, message, type, status)
			VALUES ${values}
		`,
		params
	);

	const insertedNotifications = notifications.map((notification, index) => ({
		id: result.insertId + index, // Calculamos el ID insertado
		userId: notification.userId,
		message: notification.message,
	}));

	return insertedNotifications; // Devuelve el ID de las notificaciones creada
};

export default sendReviewNotificationsModel;
