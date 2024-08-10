export interface FeedEmail {
    ID: string;
    tenant: string;
    shipment_id: string;
    master_email: string;
    received_date_time: string;
    to_email_address: string;
    subject: string;
    body_content: string;
  }

export interface FeedEmailResponse {
  feed_emails: FeedEmail[];
}