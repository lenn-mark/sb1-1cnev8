```typescript
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import shipmentRoutes from './routes/shipment.routes';
import tagRoutes from './routes/tag.routes';
import alarmRoutes from './routes/alarm.routes';
import subscriptionRoutes from './routes/subscription.routes';
import settingsRoutes from './routes/settings.routes';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/shipments', shipmentRoutes);
app.use('/api/tags', tagRoutes);
app.use('/api/alarms', alarmRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/settings', settingsRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
```