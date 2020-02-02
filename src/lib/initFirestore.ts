import { Firestore, Settings } from '@google-cloud/firestore';

export default (config: Settings) => new Firestore(config);
