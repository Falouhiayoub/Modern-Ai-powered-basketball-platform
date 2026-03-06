import { supabase } from './supabase';

export const fanService = {
  async subscribeToNewsletter(email: string, firstName?: string, lastName?: string) {
    const { data, error } = await supabase
      .from('fans')
      .insert({ 
        email, 
        first_name: firstName || null, 
        last_name: lastName || null 
      } as any)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async sendMessage(senderName: string, senderEmail: string, content: string, subject?: string) {
    const { data, error } = await supabase
      .from('messages')
      .insert({ 
        sender_name: senderName, 
        sender_email: senderEmail, 
        content, 
        subject: subject || null 
      } as any)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async applyForTryouts(application: {
    firstName: string;
    lastName: string;
    email: string;
    age: number;
    height?: string;
    position?: string;
    experience?: string;
  }) {
    const { data, error } = await supabase
      .from('tryouts')
      .insert({
        first_name: application.firstName,
        last_name: application.lastName,
        email: application.email,
        age: application.age,
        height: application.height || null,
        position: application.position || null,
        experience: application.experience || null,
      } as any)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
};
