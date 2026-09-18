-- Create a trigger function to create a notification when an order is placed
CREATE OR REPLACE FUNCTION handle_new_order_notification()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO notifications (user_id, title, message, type)
    VALUES (
        NEW.user_id,
        'Order Confirmed',
        'Your order #' || substr(NEW.id::text, 1, 8) || ' has been placed successfully and is being processed.',
        'Order'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger on the orders table
DROP TRIGGER IF EXISTS on_order_created_notification ON orders;
CREATE TRIGGER on_order_created_notification
    AFTER INSERT ON orders
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_order_notification();
