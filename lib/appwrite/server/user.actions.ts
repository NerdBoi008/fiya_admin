'use server'

import { User } from "@/types";
import { createAdminClient, createSessionClient } from ".";
import { generateHash } from "@/lib/utils";
import { cookies } from "next/headers";
import { getCachedUser, setCachedUser } from "./cache";
import { AppwriteConfig } from "../config";
import { ID } from "node-appwrite";

/**
 * Fetches the signed-in user's details with caching to avoid redundant API calls.
 * 
 * @returns {Promise<User | null>} The signed-in user or `null` if not signed in or on error.
 */
export async function getSignedInUser(): Promise<User | null> {
    // Cache configuration
    const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds
    const currentTime = Date.now();

    try {
        // Check and return cached user data if valid
        const cachedUser = getCachedUser();
        if (cachedUser && currentTime < cachedUser.expiry) {
            console.log({
                getSignedInUserOutput: cachedUser.data
            });
            return cachedUser.data;
        }

        // Create a session client and fetch the signed-in user ID
        const { account } = await createSessionClient();
        const userId = (await account.get()).$id;

        // Retrieve user information based on the user ID
        const user = await getUserInfo(userId);
        if (!user) {
            throw new Error('User data is undefined');
        }

        // Cache the fetched user data with an expiry timestamp
        setCachedUser({
            data: user,
            expiry: currentTime + CACHE_DURATION,
        });

        return user;
    } catch (error) {
        if (error instanceof Error) {
            console.error('Failed to fetch signed-in user:', error.message || error);
        } else {
            console.error('Failed to fetch signed-in user:', error);
        }
        return null;
    }
}

/**
 * Handles user sign-up with email, creating an account and storing user details in the database.
 * 
 * @param {string} firstName - The user's first name.
 * @param {string} lastName - The user's last name.
 * @param {string} email - The user's email address.
 * @param {string} password - The user's password.
 * @param {string} phone - The user's phone number.
 * @param {boolean} receiveUpdates - Whether the user wants to receive updates.
 * @param {boolean} rememberMe - Whether to keep the user logged in.
 * @returns {Promise<boolean>} - Returns true if sign-up is successful, otherwise throws an error.
 */
export async function signUpWithEmail(
    firstName: string, 
    lastName: string, 
    email: string, 
    password: string, 
    phone: string, 
    receiveUpdates: boolean, 
    rememberMe: boolean
): Promise<boolean> {
    try {
        // Initialize Appwrite admin client
        const { account, databases, users } = await createAdminClient();

        // Hash the password for security
        const hashedPassword = generateHash(password);
        
        // Create a new user in Appwrite account
        const newUser = await account.create(ID.unique(), email, hashedPassword, `${firstName} ${lastName}`);
        if (!newUser) {
            throw new Error('Failed to create user');
        }

        // Create an email-password session for the new user
        const session = await account.createEmailPasswordSession(email, hashedPassword);
        
        // Store session in cookies
        const cookieStore = await cookies();
        cookieStore.set('register-session', session.secret, {
            path: '/',
            httpOnly: true,
            sameSite: 'strict',
            secure: true,
            expires: rememberMe ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) : undefined, // 7 days or session cookie
        });
        
        // Prepare user data for database storage
        const userDocData: User = {
            id: session.userId,
            firstName: firstName,
            lastName: lastName,
            email: email,
            cart: [],
            phone: phone,
            receiveUpdates: receiveUpdates,
            profileImgSrc: "https://avatars.githubusercontent.com/u/96974553?v=4"
        };

        // Create a user document in the database
        const userCreated = await databases.createDocument(
            AppwriteConfig.database,
            AppwriteConfig.usersCollection,
            session.userId,
            userDocData
        );

        // Rollback user creation if document creation fails
        if (!userCreated) {
            await users.delete(session.userId);
            throw new Error('Error while creating user document');
        }

        return true;
    } catch (error) {
        console.error('Error during sign-up:', error); // Logs the error for debugging
        throw new Error('Sign-up failed. Please check your internet connection'); // Throws a user-friendly error
    }
}

/**
 * Authenticates a user by creating an email-password session and setting a secure cookie.
 * Implements "remember me" functionality for persistent login.
 *
 * @param email - The email address of the user attempting to sign in.
 * @param password - The plain-text password of the user.
 * @param rememberMe - A boolean indicating whether the session should persist.
 * @returns A promise that resolves to `true` if sign-in is successful, or rejects with an error.
 *
 * @throws Will throw an error if the sign-in process fails.
 *
 * @example
 * // Sign-in with "remember me" enabled
 * try {
 *   const isSignedIn = await signIn('user@example.com', 'password123', true);
 *   console.log(isSignedIn); // true
 * } catch (error) {
 *   console.error('Sign-in failed:', error);
 * }
 */
export async function signIn(email: string, password: string, rememberMe: boolean): Promise<boolean> {
    try {
      // Creates the admin client instance
      const { account } = await createAdminClient();
  
      // Hash the provided password
      const hashedPassword = generateHash(password);
  
      // Creates an email-password session
      const session = await account.createEmailPasswordSession(email, hashedPassword);
  
      // Sets a secure cookie for the session
      const cookieStore = await cookies();
      cookieStore.set('auth-session', session.secret, {
        path: '/',
        httpOnly: true,
        sameSite: 'strict',
        secure: true,
        expires: rememberMe ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) : undefined, // 7 days or session cookie
      });
  
      return true; // Sign-in was successful
    } catch (error) {
      console.error('Error during sign-in:', error); // Logs the error for debugging
      throw new Error('Sign-in failed. Please check your credentials and try again.'); // Throws a user-friendly error
    }
}

export async function getUserInfo(userId: string): Promise<User | null> {
    try {
        const { databases } = await createAdminClient();

        const document = await databases.getDocument(
            AppwriteConfig.database,
            AppwriteConfig.usersCollection,
            userId
        );

        if (!document) {
            throw new Error('User document not found');
        }

        return {
            id: userId,
            firstName: document.firstName,
            lastName: document.lastName,
            email: document.email,
            phone: document.phone,
            receiveUpdates: document.receiveUpdates,
            profileImgSrc: document.profileImgSrc,
            cart: document.cart,
        };
    } catch (error) {
        console.error('Failed to fetch user info:', error);
        return null;
    }
}

/**
 * Signs out the current user by deleting the session cookie and ending the active session.
 *
 * @returns A promise that resolves to `true` if the sign-out is successful, or rejects with an error.
 *
 * @throws Will throw an error if the sign-out process fails.
 *
 * @example
 * try {
 *   const isSignedOut = await signOut();
 *   if (isSignedOut) {
 *     console.log('User signed out successfully');
 *   }
 * } catch (error) {
 *   console.error('Sign-out failed:', error);
 * }
 */
export async function signOut(): Promise<boolean> {
    try {
      // Creates the session client instance
      const { account } = await createSessionClient();
  
      // Deletes the session cookie
      const cookieStore = await cookies();
      cookieStore.delete('auth-session');
  
      // Deletes the current session from the account
      await account.deleteSession('current');
  
      return true; // Sign-out was successful
    } catch (error) {
      console.error('Error during sign-out:', error); // Logs the error for debugging
      throw new Error('Sign-out failed. Please try again.'); // Throws a user-friendly error
    }
}