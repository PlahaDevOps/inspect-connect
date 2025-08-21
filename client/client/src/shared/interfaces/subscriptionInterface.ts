export interface SubscriptionPlan {
	_id?: string;
	id?: string;
	name: string;
	description?: string;
	price: number;
	currency?: string; // e.g., 'USD'
	trialDays?: number;
	userType?: number; // 0 = inspector, 1 = client
	frequencyInterval?: number; // 0 = monthly, 1 = yearly
	status?: number; // 0 = inactive, 1 = active
	features?: string[]; // optional, client-only convenience
}
export interface CreateSubscriptionPayload {
	customerId: string;
	planId: string;
	isManual: number;
}

export interface CreateCheckoutSessionPayload {
	customerId: string;
	priceId: string;
	successUrl: string;
	cancelUrl: string;
}

export interface CreateSubscriptionResponse {
	id?: string;
	status?: string;
	latest_invoice?: {
		hosted_invoice_url?: string;
		invoice_pdf?: string;
		[k: string]: any;
	};
	[k: string]: any;
}


