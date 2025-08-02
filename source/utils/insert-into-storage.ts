import {minioClient} from './file-management.js';
import mime from 'mime-types';

const insertIntoStorage = async (
	bucketPath: string | null,
	filePath: string | null,
) => {
	if (!filePath || !bucketPath) return false;

	const fileName = filePath.split('/').pop();

	const metadata = {
		'Content-Type': mime.lookup(fileName ?? '') || 'application/octet-stream',
	};

	try {
		const file = await minioClient.fPutObject(
			process.env['S3_BUCKET_NAME']!,
			`${bucketPath}/${fileName}`,
			filePath,
			metadata,
		);

		if (!file) return false;

		return `/${bucketPath}/${fileName}`;
	} catch (error) {
		console.error(error);
		return false;
	}
};

export default insertIntoStorage;
